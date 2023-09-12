import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { TabService } from '@core/services/common/tab.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, NzAlertModule, NzButtonModule, NzInputModule, NzWaveModule]
})
export class TabsComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ về hoạt động của trang tab. Nếu bạn cần hiển thị chi tiết trên trang tab hiện tại, vui lòng nhấp vào nút xem bảng trong "Trang danh sách > Bảng truy vấn" để minh họa hiệu ứng.',
    breadcrumb: ['Home', 'Tiện ích mở rộng', 'Ví dụ về hoạt động của trang tab']
  };
  routerPath = this.router.url;

  constructor(private router: Router, private tabService: TabService, private cdr: ChangeDetectorRef) {}

  changeTabTitle(title: string): void {
    this.tabService.changeTabTitle(title);
  }

  closeRight(): void {
    this.tabService.delRightTab(this.router.url, this.tabService.getCurrentTabIndex());
  }
  closeLeft(): void {
    this.tabService.delLeftTab(this.router.url, this.tabService.getCurrentTabIndex());
  }

  closeOther(): void {
    this.tabService.delOtherTab(this.router.url, this.tabService.getCurrentTabIndex());
  }

  closeCurrent(): void {
    const tabArray = this.tabService.getTabArray();
    this.tabService.delTab(tabArray[this.tabService.getCurrentTabIndex()], this.tabService.getCurrentTabIndex());
  }

  openDetailPage(i: number): void {
    this.router.navigate(['default/feat/tabs/example-detail'], { queryParams: { id: i } });
  }

  refresh(): void {
    this.tabService.refresh();
  }

  ngOnInit(): void {}
}
