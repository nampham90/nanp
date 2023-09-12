import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { LoginService } from '@core/services/http/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfo, UserInfoService } from '@store/common-store/userInfo.service';
import { fnCheckForm } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AccountService } from '@app/core/services/http/system/account.service';

import { AvatarStoreService } from '@app/core/services/store/common-store/avatar-store.service';
import { TokenStoreService } from '@app/core/services/store/common-store/token-store.service';
import { SocketService } from '@app/core/services/common/socket.service';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzTabsModule, NzGridModule, NzButtonModule, NzInputModule, NzWaveModule, NzCheckboxModule, NzIconModule, RouterLink, NzNotificationModule]
})
export class LoginFormComponent implements OnInit {
  validateForm!: FormGroup;
  userDetail!: UserInfo;
  linkavatar = "";
  destroyRef = inject(DestroyRef);
  constructor(
    private fb: FormBuilder,
    private loginInOutService: LoginInOutService,
    private menuService: MenuStoreService,
    private dataService: LoginService,
    private spinService: SpinService,
    private windowServe: WindowService,
    private userInfoService: UserInfoService,
    private notification: NzNotificationService,
    private router: Router,
    private userService: AccountService,
    private avatarService: AvatarStoreService,
    private tokenStoreService: TokenStoreService,
    private socketService: SocketService
  ) {}

  submitForm(): void {
    // Check form
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    // Loading
    this.spinService.setCurrentGlobalSpinStore(true);
    // Lấy giá trị của form
    const param = this.validateForm.getRawValue();
    // Gọi API đăng nhập
    //Cần lưu ý, mô-đun đăng nhập trả về dạng thống nhất từ phía máy chủ, nếu code không phải là 0, sẽ tự động bị chặn. Nếu cần thay đổi, vui lòng chỉnh sửa tại src/app/core/services/http/base-http.service.ts
    // {
    //   code:number,
    //   data:any,
    //   msg：string
    // }
    this.dataService
      .login(param)
      .pipe(
        //  Dù sao, đặt loading toàn cầu thành false.
        finalize(() => {
          this.spinService.setCurrentGlobalSpinStore(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(userToken => {
        this.loginInOutService
          .loginIn(userToken)
          .then(() => {
            this.router.navigateByUrl('default/dashboard/analysis');
          })
          .finally(() => {
            this.spinService.setCurrentGlobalSpinStore(false);
          });
      });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [null],
      mobile: [null]
    });
  }
}
