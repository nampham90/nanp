import { BreakpointObserver } from '@angular/cdk/layout';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from '@core/services/validators/validators.service';
import { fnCheckForm } from '@utils/tools';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { localUrl } from '@env/environment.prod';
import * as Const from "@app/common/const"
import { WebserviceService } from '@app/core/services/common/webservice.service';
import { UserInfo, UserInfoService } from '@app/core/services/store/common-store/userInfo.service';
import { AccountService, User } from '@app/core/services/http/system/account.service';
import {serverUrl} from '@env/environment.prod'
import { AvatarStoreService } from '@app/core/services/store/common-store/avatar-store.service';
@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzGridModule,
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NgFor,
    NzButtonModule,
    NzWaveModule,
    NgClass,
    NgIf,
    NzAvatarModule,
    NzUploadModule,
    NzIconModule
  ]
})
export class BaseComponent implements OnInit {
  @Input() data!: { label: string };
  validateForm!: FormGroup;
  selectedProvince = 1;
  selectedCity = 1;
  provinceData: any[] = [];
  formOrder = 1;
  avatarOrder = 0;
  cityData: any[] = [];
  destroyRef = inject(DestroyRef);
  url: string;
  serverurl:string;

  userDetail!: UserInfo;
  User!: User
  linkavatar = signal("");

  constructor(
    private userInfoService: UserInfoService, 
    private fb: FormBuilder, 
    private msg: NzMessageService, 
    private validatorsService: ValidatorsService, 
    private breakpointObserver: BreakpointObserver, 
    private cdr: ChangeDetectorRef,
    private userService: AccountService,
    private avatarService: AvatarStoreService,
    private webService : WebserviceService) {
    this.url = localUrl + Const.Tmt010Ant100SaveFile;
    this.serverurl = serverUrl;
  }

  provinceChange(code: number): void {
    this.cityData = this.getCity(code);
    this.selectedProvince = code;
    this.validateForm.get('city')?.setValue(this.cityData);
  }

  getCity(code: any) {
    let lst : any;
    for(let element of this.provinceData) {
       if(element['code'] == code) {
          lst = element['districts'];
          break;
       }
    }
    return lst;
  }

  setAvatar() {
    this.userInfoService.getUserInfo().subscribe(res => {
      this.userDetail = {
        userId: res.userId,
        username: res.username,
        authCode: [],
        email: res.email
      };
    });
    if(this.userDetail.userId) {
      this.userService.getAccountDetail(this.userDetail.userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res=> {
        if(res.avatar) {
          this.avatarService.setAvatarStore(serverUrl + res.avatar.path);
        }
      })
    }
  }

  initForm(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      area: [null, [Validators.required]],
      nickName: [null],
      desc: [null, [Validators.required]],
      city: [null, [Validators.required]],
      province: [null, [Validators.required]],
      mobile: [null, [Validators.required, this.validatorsService.mobileValidator()]],
      telephone: [null, [Validators.required, this.validatorsService.telephoneValidator()]],
      street: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
  }

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {
      this.setAvatar();
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  obBreakPoint(): void {
    this.breakpointObserver
      .observe(['(max-width: 1200px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result.matches) {
          this.formOrder = 1;
          this.avatarOrder = 0;
        } else {
          this.formOrder = 0;
          this.avatarOrder = 1;
        }
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    this.webService.GetCallProvinces(response=>{
      this.provinceData = response;
      console.log(this.provinceData);
    })
    this.initForm();
    this.obBreakPoint();
    this.avatarService.getAvatarStore()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(avatar => {
       this.linkavatar.set(avatar);
    })
  }
}
