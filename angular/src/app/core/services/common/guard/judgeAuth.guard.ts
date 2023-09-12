import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild, CanActivateChildFn } from '@angular/router';
import { Observable } from 'rxjs';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnGetUUID } from '@utils/tools';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Menu } from '../../types';
import { WindowService } from '../window.service';

// Những ai quan tâm có thể xem tranh cãi giữa class và fn https://github.com/angular/angular/pull/47924
// Ở đây tôi cung cấp một cách viết khác JudgeLogin.guard.ts để bạn tham khảo. Bạn cũng có thể vào trang web chính thức để tìm api mapToCanActivate.
// Được sử dụng để xác định xem người dùng có được phép vào trang doanh nghiệp khi chuyển tuyến hay không và chuyển sang trang đăng nhập nếu không
@Injectable({
  providedIn: 'root'
})
export class JudgeAuthGuardService {
  authCodeArray: string[] = [];
  selMenu: Menu | null = null;
  menuNavList: Menu[] = [];
  destroyRef = inject(DestroyRef);

  constructor(
    private windowSrc: WindowService,
    private loginOutService: LoginInOutService,
    private router: Router,
    private userInfoService: UserInfoService,
    private menuStoreService: MenuStoreService,
    private message: NzMessageService
  ) {
    this.menuStoreService
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.menuNavList = res;
      });
  }

  // Lưu menu hiện tại vào this.selMenu
  getMenu(menu: Menu[], url: string): void {
    for (let i = 0; i < menu.length; i++) {
      if (url === menu[i].path) {
        this.selMenu = menu[i];
        return;
      } else {
        if (menu[i].children && menu[i].children!.length > 0) {
          this.getMenu(menu[i].children!, url);
        }
      }
    }
  }

  getResult(code: string, authCodeArray: string[]): boolean | UrlTree {
    if (authCodeArray.includes(code)) {
      return true;
    } else {
      this.message.error('Bạn không có quyền đăng nhập vào module này');
      this.loginOutService.loginOut();
      return this.router.parseUrl('/login');
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.userInfoService
      .getUserInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => (this.authCodeArray = res.authCode));
    while (route.firstChild) {
      route = route.firstChild;
    }
    // Nếu có authCode, điều đó có nghĩa là việc nhấp vào nút trên trang sẽ chuyển sang tuyến đường mới chứ không phải tuyến đường trong menu
    if (!!route.data['authCode']) {
      return this.getResult(route.data['authCode'], this.authCodeArray);
    }

    // Nếu đó là một nút trên menu, hãy đi xuống bên dưới
    this.getMenu(this.menuNavList, state.url);
    // Không tìm thấy menu, đi thẳng đến trang đăng nhập
    if (!this.selMenu) {
      return this.getResult(fnGetUUID(), this.authCodeArray);
    }
    const selMenuCode = this.selMenu.code;
    this.selMenu = null;
    // Nếu tìm thấy menu nhưng người dùng không sở hữu mã cấp phép của menu, nó sẽ chuyển đến trang đăng nhập.
    return this.getResult(selMenuCode!, this.authCodeArray);
  }
}

export const JudgeAuthGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(JudgeAuthGuardService).canActivateChild(childRoute, state);
};
