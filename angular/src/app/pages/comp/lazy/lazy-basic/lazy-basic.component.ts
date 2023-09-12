import { NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit } from '@angular/core';

import { LazyServiceService } from '@app/pages/comp/lazy/lazy-service.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AdDirective } from '@shared/directives/ad.directive';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';

@Component({
  selector: 'app-lazy-basic',
  templateUrl: './lazy-basic.component.html',
  styleUrls: ['./lazy-basic.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LazyServiceService],
  standalone: true,
  imports: [PageHeaderComponent, NgIf, NzButtonModule, NzWaveModule, AdDirective]
})
export class LazyBasicComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ về thành phần lười biếng',
    breadcrumb: ['Home', 'Các thần phần', 'Tải các thành phần lười biếng'],
    desc: 'Tải các thành phần lười biếng, Tôi sẽ luôn thích Jay Chou'
  };
  @ViewChild(AdDirective, { static: true }) adHost!: AdDirective;
  isStarted = false;

  constructor(public lazyServiceService: LazyServiceService) {}

  ngAfterViewInit(): void {
    this.lazyServiceService.adHost = this.adHost;
  }

  ngOnInit(): void {}
}
