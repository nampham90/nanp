import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType } from '@shared/components/page-header/page-header.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PasswordStrengthMeterComponent } from '../../../shared/biz-components/password-strength-meter/password-strength-meter.component';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
    selector: 'app-strength-meter',
    templateUrl: './strength-meter.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [PageHeaderComponent, NzGridModule, NzCardModule, NzButtonModule, NzInputModule, FormsModule, PasswordStrengthMeterComponent, NzIconModule]
})
export class StrengthMeterComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Thành phần xác minh độ mạnh mật khẩu',
    breadcrumb: ['Home', 'Các thành phân', 'Thành phần xác minh độ mạnh mật khẩu'],
    desc: 'Kiểm tra xem mật khẩu của bạn có đủ mạnh không'
  };
  passwordVisible = false;
  newPassword!: string;

  constructor() {}

  ngOnInit(): void {}
}
