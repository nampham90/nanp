import { NgTemplateOutlet, NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, signal, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { AccountService, User, UserPsd } from '@services/system/account.service';
import { ScreenLessHiddenDirective } from '@shared/directives/screen-less-hidden.directive';
import { ToggleFullscreenDirective } from '@shared/directives/toggle-fullscreen.directive';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfo, UserInfoService } from '@store/common-store/userInfo.service';
import { ModalBtnStatus } from '@widget/base-modal';
import { ChangePasswordService } from '@widget/biz-widget/change-password/change-password.service';
import { LockWidgetService } from '@widget/common-widget/lock-widget/lock-widget.service';
import { SearchRouteService } from '@widget/common-widget/search-route/search-route.service';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { HomeNoticeComponent } from '../home-notice/home-notice.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AvatarStoreService } from '@app/core/services/store/common-store/avatar-store.service';

@Component({
  selector: 'app-layout-head-right-menu',
  templateUrl: './layout-head-right-menu.component.html',
  styleUrls: ['./layout-head-right-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ScreenLessHiddenDirective,
    NzToolTipModule,
    NzIconModule,
    NzButtonModule,
    ToggleFullscreenDirective,
    NgIf,
    NzDropDownModule,
    NzBadgeModule,
    NzMenuModule,
    HomeNoticeComponent
  ]
})
export class LayoutHeadRightMenuComponent implements OnInit {
  user!: UserPsd;
  userDetail!: UserInfo;
  totalNotifi = 0;
  linkavatar = signal("");
  destroyRef = inject(DestroyRef);
  User!: User
  constructor(
    private router: Router,
    private changePasswordModalService: ChangePasswordService,
    private spinService: SpinService,
    private loginOutService: LoginInOutService,
    private lockWidgetService: LockWidgetService,
    private windowServe: WindowService,
    private activatedRoute: ActivatedRoute,
    private searchRouteService: SearchRouteService,
    public message: NzMessageService,
    private userInfoService: UserInfoService,
    private accountService: AccountService,
    private modalSrv: NzModalService,
    private avatarService: AvatarStoreService,
  ) {
  }

  // Khóa màn hình
  lockScreen(): void {
    this.lockWidgetService
      .show({
        nzTitle: 'Khóa màn hình',
        nzStyle: { top: '25px' },
        nzWidth: '520px',
        nzFooter: null,
        nzMaskClosable: true
      })
      .subscribe();
  }

  // Thay đổi mật khẩu
  changePassWorld(): void {
    this.changePasswordModalService.show({ nzTitle: 'Thay đổi mật khẩu' }).subscribe(({ modalValue, status }) => {
      if (status === ModalBtnStatus.Cancel) {
        return;
      }
      this.userInfoService.getUserInfo().subscribe(res => {
        this.user = {
          id: res.userId,
          oldPassword: modalValue.oldPassword,
          newPassword: modalValue.newPassword
        };
      });
      this.accountService.editAccountPsd(this.user).subscribe((res) => {
        if(res['msgId'] == "") {
          this.loginOutService.loginOut().then();
          this.message.success('Sửa đổi thành công, vui lòng đăng nhập lại');
        } else {
          this.modalSrv.info({nzTitle: res['msgId'],nzContent: res['msgError']});
        }
       
      });
    });
  }

  showSearchModal(): void {
    const modalOptions: ModalOptions = {
      nzClosable: false,
      nzMaskClosable: true,
      nzStyle: { top: '48px' },
      nzFooter: null,
      nzBodyStyle: { padding: '0' }
    };
    this.searchRouteService.show(modalOptions);
  }

  goLogin(): void {
    this.loginOutService.loginOut().then();
  }

  clean(): void {
    this.windowServe.clearStorage();
    this.windowServe.clearSessionStorage();
    this.loginOutService.loginOut().then();
    this.message.success('Xóa thành công, vui lòng đăng nhập lại');
  }

  showMessage(): void {
    this.message.info('Thao tác thành công !');
  }

  goPage(path: string): void {
    this.router.navigateByUrl(`/default/page-demo/personal/${path}`);
  }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(res => {
      this.userDetail = {
        userId: res.userId,
        authCode: [],
        username: res.username,
        email: res.email
      };
    });
    // get avatar
    this.avatarService.getAvatarStore()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(avatar=> {
      this.linkavatar.set(avatar);
    })
  }
}
