import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

interface SearchParam {
  ruleName: number;
  desc: string;
}

@Component({
  selector: 'app-shrink-form',
  templateUrl: './shrink-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, FormsModule, NzFormModule, NzGridModule, NzInputModule, NzButtonModule, NzWaveModule, NzIconModule, NgIf]
})
export class ShrinkFormComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ về biểu mẫu có thể thu gọn',
    breadcrumb: ['Home', 'Các thành phần', 'Form', 'hình thức đóng mở'],
    desc: 'mở rộng đóng định thức'
  };

  searchParam: Partial<SearchParam> = {};

  isCollapse = true;

  /*cài lại*/
  resetForm(): void {
    this.searchParam = {};
  }

  /*mở rộng*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  constructor() {}

  ngOnInit(): void {}
}
