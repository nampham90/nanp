import { NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoginService } from '@core/services/http/login/login.service';
import { fnCheckForm } from '@utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BasicConfirmModalComponent } from '../../base-modal';
import { ValidatorsService } from '@app/core/services/validators/validators.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, NzInputModule, NgIf, NzIconModule]
})
export class LoginModalComponent extends BasicConfirmModalComponent implements OnInit {
  loginModalForm!: FormGroup;
  override params: object;

  passwordVisible = false;

  constructor(protected override modalRef: NzModalRef, 
    private fb: FormBuilder, 
    private loginService: LoginService,
    private validators: ValidatorsService
    ) {
    super(modalRef);
    this.params = {};
  }

  // Nếu trả về false thì không đóng hộp thoại
  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.loginModalForm)) {
      return of(false);
    }
    return this.loginService.login(this.loginModalForm.value).pipe(
      catchError(() => {
        return of(false);
      })
    );
  }

  initForm(): void {
    this.loginModalForm = this.fb.group({
      email: [null, [Validators.required, this.validators.emailValidator()]],
      password: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.initForm();
  }
}
