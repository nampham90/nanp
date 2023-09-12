import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { DriverService } from '@core/services/common/driver.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzButtonModule, NzWaveModule]
})
export class SetupComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Trang hướng dẫn',
    breadcrumb: ['Home', 'Trang hướng dẫn'],
    desc: 'Dùng để hướng dẫn người dùng'
  };

  constructor(private driverService: DriverService) {}

  go(): void {
    this.driverService.load();
  }

  ngOnInit(): void {}
}
