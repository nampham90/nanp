import { Component, OnInit, ChangeDetectionStrategy, signal, DestroyRef, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

import { LockedKey, salt } from '@config/constant';
import { WindowService } from '@core/services/common/window.service';
import { LockScreenFlag, LockScreenStoreService } from '@store/common-store/lock-screen-store.service';
import { fnCheckForm, fnEncrypt } from '@utils/tools';
import { BasicConfirmModalComponent } from '@widget/base-modal';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AvatarStoreService } from '@app/core/services/store/common-store/avatar-store.service';
import { UserInfo, UserInfoService } from '@app/core/services/store/common-store/userInfo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-lock-widget',
  templateUrl: './lock-widget.component.html',
  styleUrls: ['./lock-widget.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzAvatarModule, FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzButtonModule, NzInputModule, NzIconModule, NzWaveModule]
})
export class LockWidgetComponent extends BasicConfirmModalComponent implements OnInit {
  validateForm = this.fb.group({
    password: ['', [Validators.required]]
  });
  passwordVisible = false;
  userDetail! : UserInfo;
  linkavatar = signal("")
  destroyRef = inject(DestroyRef);
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private lockScreenStoreService: LockScreenStoreService,
    protected override modalRef: NzModalRef,
    private fb: NonNullableFormBuilder,
    private windowSrv: WindowService,
    private avatarService: AvatarStoreService,
    private userInfoService: UserInfoService, 
  ) {
    super(modalRef);
  }

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    const lockedState: LockScreenFlag = {
      locked: true,
      password: this.validateForm.value.password!,
      // @ts-ignore
      beforeLockPath: this.activatedRoute.snapshot['_routerState'].url
    };
    this.lockScreenStoreService.setLockScreenStore(lockedState);
    this.windowSrv.setSessionStorage(LockedKey, fnEncrypt(lockedState, salt));
    this.modalRef.destroy();
    this.router.navigateByUrl(`/blank/empty-for-lock`);
  }

  ngOnInit(): void {
    this.userInfoService.getUserInfo().subscribe(res => {
      this.userDetail = {
        userId: res.userId,
        username: res.username,
        authCode: [],
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

  protected getCurrentValue(): NzSafeAny {
    return of(true);
  }
}