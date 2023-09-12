import { HttpClient, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable, NgZone } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, finalize, share, switchMap } from 'rxjs/operators';

import { TokenKey, loginTimeOutCode, tokenErrorCode } from '@config/constant';
import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { ModalBtnStatus } from '@widget/base-modal';
import { LoginModalService } from '@widget/biz-widget/login/login-modal.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { WindowService } from '../common/window.service';

@Injectable()
export class LoginExpiredService implements HttpInterceptor {
  private refresher: Observable<NzSafeAny> | null = null;
  destroyRef = inject(DestroyRef);

  constructor(
    private loginModalService: LoginModalService,
    private router: Router,
    private loginInOutService: LoginInOutService,
    private zone: NgZone,
    private message: NzMessageService,
    private windowServe: WindowService,
    private http: HttpClient
  ) {}

  intercept(req: HttpRequest<string>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    const newReq = req.clone();
    return next.handle(newReq).pipe(
      filter(e => e.type !== 0),
      this.loginExpiredFn(newReq, next)
    );
  }

  private sendRequest(request: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<NzSafeAny> | null {
    return this.refresher!.pipe(
      switchMap(() => {
        const token = this.windowServe.getSessionStorage(TokenKey);
        let httpConfig = {};
        if (!!token) {
          httpConfig = { headers: request.headers.set(TokenKey, token) };
        }
        this.refresher = null;
        const copyReq = request.clone(httpConfig);
        return next.handle(copyReq).pipe(finalize(() => (this.refresher = null)));
      }),
      finalize(() => (this.refresher = null))
    );
  }

  private loginOut(): void {
    this.loginInOutService.loginOut();
    this.refresher = null;
    this.router.navigateByUrl('/login/login-form');
  }

  // Chặn hết hạn đăng nhập
  private loginExpiredFn(req: HttpRequest<string>, next: HttpHandler): NzSafeAny {
    return switchMap((event: HttpResponse<NzSafeAny>): NzSafeAny => {
      if (event.type !== HttpEventType.Response || event.body.code !== loginTimeOutCode) {
        return of(event);
      }
      if (event.body.code === tokenErrorCode) {
        this.loginOut();
        return;
      }

      if (this.refresher) {
        return this.sendRequest(req, next);
      }

      this.refresher = new Observable(observer => {
        // setTimeout được sử dụng để giải quyết vấn đề khi làm mới trang, do giao diện Zorro chưa được tải, gây hiện tượng đèn flash cho hộp thoại đăng nhập
        setTimeout(() => {
          this.loginModalService
            .show({ nzTitle: 'Thông tin đăng nhập đã hết hạn, vui lòng đăng nhập lại' })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(({ modalValue: token, status }) => {
              if (status === ModalBtnStatus.Cancel) {
                // // Thực hiện điều này để giải quyết tình huống khi token hết hạn trong trạng thái đăng nhập, làm mới trang, sau đó nhấp vào hủy trong cửa sổ đăng nhập, cần hoàn thành giao diện API lấy menu trong phần khởi chạy (startUp),
                // Nếu không, sẽ không thể truy cập ứng dụng Angular, không có chuyển đổi định tuyến.
                observer.next(
                  new HttpResponse({
                    body: {
                      code: 3013,
                      msg: 'Sau khi hủy, vui lòng đăng nhập lại.',
                      data: null
                    }
                  })
                );
                this.loginOut();
                return;
              }
              this.loginInOutService.loginIn(token).then();
              this.http
                .request(req)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                  next: (data: NzSafeAny) => {
                    this.refresher = null;
                    observer.next(data);
                  },
                  error: () => {
                    // Nếu bạn đăng nhập vào hệ thống với tư cách admin trước, khi token hết hạn sẽ xuất hiện hộp thoại đăng nhập. Tuy nhiên, sau khi đăng nhập, bạn đang sử dụng tài khoản normal, không có quyền truy cập vào trang mục tiêu, do đó sẽ quay trở lại trang đăng nhập
                    // Ở đây, việc kiểm tra bởi phía máy chủ xác định rằng token mới không có quyền, dẫn đến yêu cầu bị lỗi 403."
                    this.message.error('Bạn không có quyền truy cập vào mô-đun này.');
                    this.loginOut();
                  }
                });
            });
        }, 100);
      }).pipe(
        share(),
        finalize(() => (this.refresher = null))
      );
      return this.refresher;
    });
  }
}
