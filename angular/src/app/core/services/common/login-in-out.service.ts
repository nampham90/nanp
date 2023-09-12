import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@config/actionCode';
import { TokenKey, TokenPre } from '@config/constant';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { TabService } from '@core/services/common/tab.service';
import { WindowService } from '@core/services/common/window.service';
import { Menu } from '@core/services/types';
import { LoginService } from '@services/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { UserInfo, UserInfoService } from '@store/common-store/userInfo.service';
import { fnFlatDataHasParentToTree } from '@utils/treeTableTools';
import { AccountService, User } from '../http/system/account.service';
import {serverUrl} from '@env/environment.prod'
import { AvatarStoreService } from '../store/common-store/avatar-store.service';
import { TokenStoreService } from '../store/common-store/token-store.service';
import { SocketService } from './socket.service';

/*
 * đăng xuất
 * */
@Injectable({
  providedIn: 'root'
})
export class LoginInOutService {
  destroyRef = inject(DestroyRef);

  constructor(
    private activatedRoute: ActivatedRoute,
    private tabService: TabService,
    private loginService: LoginService,
    private userService: AccountService,
    private router: Router,
    private userInfoService: UserInfoService,
    private menuService: MenuStoreService,
    private windowServe: WindowService,
    private avatarService: AvatarStoreService,
    private tokenStoreService: TokenStoreService,
    private socketService: SocketService
  ) {}

  // Lấy mảng menu theo Id người dùng
  getMenuByUserId(userId: string): Observable<Menu[]> {
    return this.loginService.getMenuByUserId(userId);
  }

  loginIn(token: string): Promise<void> {
    return new Promise(resolve => {
      // Liên tục lưu mã thông báo vào bộ đệm. Xin lưu ý rằng nếu không có bộ đệm, nó sẽ bị chặn trong bộ bảo vệ tuyến và tuyến sẽ không được phép nhảy.
      // Tuyến đường này được bảo vệ tại src/app/core/services/common/guard/judgeLogin.guard.ts
      this.windowServe.setSessionStorage(TokenKey, TokenPre + token);
      // Lưu token vào store
      this.tokenStoreService.setGlobalTokenStore(token);
      // Phân tích mã thông báo và lấy thông tin người dùng
      const userInfo: UserInfo = this.userInfoService.parsToken(TokenPre + token);
      // việc cần làm Đây là quyền thêm nút theo cách thủ công để mở chi tiết trong thao tác tab trang tĩnh, vì chúng liên quan đến các bước nhảy định tuyến và chúng sẽ được bảo vệ bằng cách đi bộ, nhưng các quyền không được quản lý bởi phần phụ trợ, vì vậy hai dòng sau thêm quyền theo cách thủ công, thao tác thực tế Bạn có thể xóa 2 dòng sau trong
      userInfo.authCode.push(ActionCode.TabsDetail);
      userInfo.authCode.push(ActionCode.SearchTableDetail);
      // Lưu trữ thông tin người dùng vào dịch vụ toàn cầu
      this.userInfoService.setUserInfo(userInfo);
      
      this.userService.getAccountDetail(userInfo.userId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(res=> {
          if(res.avatar) {
            this.avatarService.setAvatarStore(serverUrl + res.avatar.path);
          }
      });
      // Nhận menu do người dùng này sở hữu thông qua ID người dùng
      this.getMenuByUserId(userInfo.userId)
        .pipe(
          finalize(() => {
            resolve();
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(menus => {
          menus = menus.filter(item => {
            item.selected = false;
            item.open = false;
            return item.menuType === 'C';
          });
          const temp = fnFlatDataHasParentToTree(menus);
          // Lưu trử Menu
          this.menuService.setMenuArrayStore(temp);
          resolve();
        });
      });
  }

  // Xóa bộ đệm Tab là một việc liên quan đến việc sử dụng lại tuyến đường.
  clearTabCash(): Promise<void> {
    return SimpleReuseStrategy.deleteAllRouteSnapshot(this.activatedRoute.snapshot).then(() => {
      return new Promise(resolve => {
        // xóa tab
        this.tabService.clearTabs();
        resolve();
      });
    });
  }

  clearSessionCash(): Promise<void> {
    return new Promise(resolve => {
      this.windowServe.removeSessionStorage(TokenKey);
      this.menuService.setMenuArrayStore([]);
      resolve();
    });
  }

  loginOut(): Promise<void> {
    return this.clearTabCash()
      .then(() => {
        return this.clearSessionCash();
      })
      .then(() => {
        this.socketService.disconnect();
        this.router.navigate(['/login/login-form']);
      });
  }
}
