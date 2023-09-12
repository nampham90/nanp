import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { fnCheckForm } from '@utils/tools';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-search-table-detail',
  templateUrl: './search-table-detail.component.html',
  standalone: true,
  imports: [PageHeaderComponent, NzInputModule, FormsModule, NzDividerModule, NzFormModule, ReactiveFormsModule, NzGridModule]
})
export class SearchTableDetailComponent implements OnInit, OnDestroy {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'chi tiết',
    // desc: 'Các trang biểu mẫu được sử dụng để thu thập hoặc xác minh thông tin từ người dùng. Các biểu mẫu cơ bản thường được sử dụng trong các tình huống biểu mẫu có ít mục dữ liệu.',
    breadcrumb: ['Home', 'Danh sách', 'mẫu yêu cầu', 'Chi tiết']
  };
  validateForm!: FormGroup;
  @Input({ required: true }) name!: string; // Các thông số thu được từ định tuyến, các tính năng mới được ng16 hỗ trợ
  backUrl = '/default/page-demo/list/search-table';
  destroyRef = inject(DestroyRef);

  constructor(private routeParam: ActivatedRoute, public cdr: ChangeDetectorRef, private fb: FormBuilder) {}

  initForm(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
  }

  _onReuseDestroy(): void {
    console.log('Tab bị hủy, hãy gọi _OnReuseDestroy');
  }

  ngOnInit(): void {
    this.initForm();
    console.log(this.name);
    this.validateForm.get('userName')?.setValue(this.name);
  }

  ngOnDestroy(): void {
    console.log('Thành phần này bị hủy và ngOnDestroy được gọi.');
  }
}
