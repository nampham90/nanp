import { DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DateFormat } from '@shared/pipes/map.pipe';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, NzDescriptionsModule, NzTagModule, DatePipe]
})
export class AboutComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    console.log('123');
  }
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Về chúng tôi',
    breadcrumb: ['Home', 'Các tính năng mở rộng', 'Về chúng tôi'],
    desc: 'NANP là một giải pháp quản lý trang quản trị dựa trên Angular và ng-zorro. Mục tiêu của chúng tôi là cung cấp một giải pháp sẵn có và các ví dụ phong phú cho việc phát triển dự án trung và lớn, không giới hạn bất kỳ mã nguồn nào để sử dụng cho mục đích kinh doanh'
  };
  data = new Date();
  dateFormat = DateFormat.DateTime;
  constructor() {}

  ngOnInit(): void {}
}
