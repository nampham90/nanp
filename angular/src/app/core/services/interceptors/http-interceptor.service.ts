import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { TokenKey } from '@config/constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { WindowService } from '../common/window.service';

interface CustomHttpConfig {
  headers?: HttpHeaders;
}

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private windowServe: WindowService, public message: NzMessageService) {}

  intercept(req: HttpRequest<NzSafeAny>, next: HttpHandler): Observable<HttpEvent<NzSafeAny>> {
    const token = this.windowServe.getSessionStorage(TokenKey);
    let httpConfig: CustomHttpConfig = {};
    if (!!token) {
      httpConfig = { headers: req.headers.set(TokenKey, token) };
    }
    const copyReq = req.clone(httpConfig);
    return next.handle(copyReq).pipe(
      filter(e => e.type !== 0),
      catchError(error => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const status = error.status;
    let errMsg = '';
    if (status === 0) {
      errMsg = 'Mạng gặp phải lỗi không xác định, vui lòng kiểm tra kết nối mạng của bạn.';
    }
    if (status >= 300 && status < 400) {
      errMsg = `Mạng gặp phải lỗi không xác định, vui lòng kiểm tra kết nối mạng của bạn.${status}`;
    }
    if (status >= 400 && status < 500) {
      errMsg = `Lỗi từ phía khách hàng, có thể do dữ liệu gửi đi không chính xác, mã trạng thái là${status}`;
    }
    if (status >= 500) {
      errMsg = `Máy chủ gặp phải lỗi, mã trạng thái là ${status}`;
    }

    return throwError(() => {
      return {
        code: status,
        message: errMsg
      };
    });
  }
}
