import { NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzProgressStatusType } from 'ng-zorro-antd/progress/typings';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'app-standard-table',
  templateUrl: './standard-table.component.html',
  styleUrls: ['./standard-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    WaterMarkComponent,
    NzGridModule,
    NzStatisticModule,
    NzDividerModule,
    NzRadioModule,
    NzButtonModule,
    NzInputModule,
    NzWaveModule,
    NzIconModule,
    NzListModule,
    NgFor,
    NzProgressModule,
    NzDropDownModule,
    NzMenuModule,
    NzPaginationModule
  ]
})
export class StandardTableComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'danh sách tiêu chuẩn',
    breadcrumb: ['Home', 'Trang danh sách', 'danh sách tiêu chuẩn']
  };
  isSpinning = false;
  list: Array<{
    id: number;
    name: string;
    desc: string;
    avatar: string;
    owner: string;
    owner_id: string;
    time: string;
    progress: number;
    progress_status: NzProgressStatusType;
  }> = [
    {
      id: 1,
      name: 'Alipay',
      desc: 'Đó là thứ gì đó bên trong mà họ không thể với tới, không thể chạm tới',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      owner: 'Nam Phạm',
      owner_id: '1',
      time: '2020-11-18 15:12',
      progress: 75,
      progress_status: 'active'
    },
    {
      id: 2,
      name: 'Angular',
      desc: 'Hy vọng là điều tốt, có thể là điều tốt nhất, điều tốt đẹp sẽ không chết',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      owner: 'Nam Phạm',
      owner_id: '2',
      time: '2020-11-19 07:51',
      progress: 93,
      progress_status: 'exception'
    },
    {
      id: 3,
      name: 'Ant Design',
      desc: 'Cuộc đời giống như một hộp sôcôla, kết quả thường không ngờ tới',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      owner: 'Nam Phạm',
      owner_id: '3',
      time: '2020-11-19 05:51',
      progress: 94,
      progress_status: 'active'
    },
    {
      id: 4,
      name: 'Ant Design Pro',
      desc: 'Trong thị trấn có rất nhiều quán rượu nhưng cô ấy vừa bước vào quán rượu của tôi',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      owner: 'Nam Phạm',
      owner_id: '4',
      time: '2020-11-19 03:51',
      progress: 93,
      progress_status: 'active'
    },
    {
      id: 5,
      name: 'Bootstrap',
      desc: 'Lúc đó tôi chỉ nghĩ đến những gì mình muốn chứ không bao giờ nghĩ đến những gì mình có.',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      owner: 'Nam Phạm',
      owner_id: '5',
      time: '2020-11-19 01:51',
      progress: 91,
      progress_status: 'exception'
    }
  ];

  constructor() {}

  edit(item: NzSafeAny): void {}

  deleteItem(item: NzSafeAny): void {}

  ngOnInit(): void {}
}
