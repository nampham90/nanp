import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-desc',
  templateUrl: './desc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzGridModule, NzCardModule, NzDescriptionsModule, NzToolTipModule, NzIconModule, NzButtonModule]
})
export class DescComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ thành phần chi tiết',
    breadcrumb: ['Home', 'Các thành phần', 'Thành phần chi tiết'],
    desc: 'Một loạt các thành phần chi tiết'
  };

  constructor() {}

  ngOnInit(): void {}
}
