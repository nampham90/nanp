import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationFormService } from '@app/core/services/common/message-errors.service';
import { fnCheckForm } from '@app/utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-subdemo',
  templateUrl: './subdemo.component.html',
  styleUrls: ['./subdemo.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule,
    NzFormModule, 
    ReactiveFormsModule, 
    NzGridModule, 
    NzInputModule, 
    NgIf,
    NzButtonModule
  ]
})
export class SubdemoComponent implements OnInit {
  addEditForm!: FormGroup;
  params!: any;
  isEdit = signal(false);

  constructor(
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    public vf: ValidationFormService,
    public message: NzMessageService,
  ) {}

  protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
    return of(modalValue);
  }

  protected getCurrentValue(): Observable<NzSafeAny> {
    if (!fnCheckForm(this.addEditForm)) {
        return of(false);
    }
    return of(this.addEditForm.value);
  }

  get f():{ [key: string]: AbstractControl } {
    return this.addEditForm.controls;   
  }

  ngOnInit(): void {
    this.initForm();
    if (Object.keys(this.params).length > 0) {
      this.isEdit.set(true);
      this.addEditForm.patchValue(this.params);
    }
  }

  initForm(): void {
    this.addEditForm = this.fb.group({
        idpro: [null, [Validators.required]],
        proname: [null, [Validators.required]],
        price: [null],
    });
  }

}
