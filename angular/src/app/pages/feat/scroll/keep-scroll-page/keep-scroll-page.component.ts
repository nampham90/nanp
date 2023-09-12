import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-keep-scroll-page',
  templateUrl: './keep-scroll-page.component.html',
  styleUrls: ['./keep-scroll-page.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, NzGridModule]
})
export class KeepScrollPageComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Thanh cuộn bộ nhớ đệm',
    breadcrumb: ['Home', 'Mở rộng chức năng', 'Thanh cuộn bộ nhớ đệm'],
    desc: 'Sau 2 ngày làm việc, cuối cùng tôi cũng hài lòng, theo mặc định, những trang có thể sử dụng lại sẽ lưu vào bộ nhớ đệm thanh cuộn. Nếu trang được đặt thành không được sử dụng lại thì thanh cuộn cũng sẽ không được lưu vào bộ đệm. Nếu bạn cần một trang có thể sử dụng lại mà không cần lưu thanh cuộn vào bộ nhớ đệm, hãy đặt needKeepScroll thành no trong cấu hình định tuyến.'
  };
  constructor() {}

  ngOnInit(): void {}
}
