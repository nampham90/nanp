import { NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { LockedKey, salt } from '@config/constant';
import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { LockScreenFlag, LockScreenStoreService } from '@store/common-store/lock-screen-store.service';
import { fnCheckForm, fnEncrypt } from '@utils/tools';
import { getDay } from 'date-fns';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

import { ChangNumberToChinesePipe } from '../../pipes/chang-number-to-chinese.pipe';
import { AvatarStoreService } from '@app/core/services/store/common-store/avatar-store.service';
import { UserInfo, UserInfoService } from '@app/core/services/store/common-store/userInfo.service';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzIconModule, NzButtonModule, NzGridModule, NgIf, NzAvatarModule, FormsModule, NzFormModule, ReactiveFormsModule, NzInputModule, ChangNumberToChinesePipe, AsyncPipe, DatePipe]
})
export class LockScreenComponent implements OnInit {
  public showUnlock = false;
  public time$: Observable<Date> = timer(0, 1000).pipe(
    map(() => new Date()),
    takeUntilDestroyed() //This.destroyRef không được thêm vào đây vì trong vòng đời https://stackoverflow.com/questions/76264067/takeuntildestroyed-can-only-be-used-within-an-injection-context
  );
  validateForm!: FormGroup;
  passwordVisible = false;
  lockedState: LockScreenFlag = {
    locked: false,
    password: '',
    beforeLockPath: '' // Định tuyến trang trước màn hình khóa
  };
  destroyRef = inject(DestroyRef);
  userDetail!: UserInfo;
  linkavatar = signal('');

  constructor(
    private router: Router, 
    private loginOutService: LoginInOutService, 
    private lockScreenStoreService: LockScreenStoreService, 
    private fb: FormBuilder, 
    private avatarService: AvatarStoreService,
    private userInfoService: UserInfoService, 
    private windowSrv: WindowService) {}

  // Quay lại trang đăng nhập để mở khóa
  loginOut(): void {
    this.unlock();
    this.loginOutService.loginOut().then();
  }

  // vào hệ thống
  intoSys(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    if (this.lockedState.locked) {
      // Nếu mật khẩu đúng, nó sẽ được mở khóa
      if (this.lockedState.password === this.validateForm.get('password')!.value) {
        this.router.navigateByUrl(this.lockedState.beforeLockPath);
        this.unlock();
      } else {
        this.validateForm.get('password')!.setErrors({ notRight: true });
      }
    }
  }

  // mở khóa
  unlock(): void {
    const lockedStatus = { locked: false, password: '', beforeLockPath: '' };
    this.lockScreenStoreService.setLockScreenStore(lockedStatus);
    this.windowSrv.setSessionStorage(LockedKey, fnEncrypt(lockedStatus, salt));
  }

  // Bấm vào nút mở khóa
  unlockBtn(): void {
    this.validateForm.reset();
    this.showUnlock = true;
  }

  getDays(date: NzSafeAny): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
    return getDay(date);
  }

  initForm(): void {
    this.validateForm = this.fb.group({
      password: [null, [Validators.required]]
    });
  }

  subLockedState(): void {
    this.lockScreenStoreService
      .getLockScreenStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.lockedState = res;
      });
  }

  ngOnInit(): void {
    this.subLockedState();
    this.initForm();
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
}
