import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ColorPickerModule } from 'ngx-color-picker';

@Component({
  selector: 'app-color-sel',
  templateUrl: './color-sel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, ColorPickerModule]
})
export class ColorSelComponent implements OnInit {
  public color: string = '#2889e9';
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Tôi chợt nghĩ đến lời bài hát "Anh đã nói thế giới đầy màu sắc không cần phải coi trọng"',
    desc: 'Tất cả các ví dụ：https://zefoy.github.io/ngx-color-picker/',
    breadcrumb: ['Home', 'Chức năng', 'bộ chọn màu']
  };
  constructor() {}

  ngOnInit(): void {}
}
