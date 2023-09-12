import { NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { fadeRouteAnimation } from '@app/animations/fade.animation';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { SearchListStoreService } from '@store/biz-store-service/search-list/search-list-store.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

interface TabInterface {
  label: string;
  url: string;
}

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation],
  standalone: true,
  imports: [PageHeaderComponent, WaterMarkComponent, NzButtonModule, NzInputModule, NzWaveModule, NzTabsModule, NgFor, RouterOutlet]
})
export class SearchListComponent implements OnInit {
  @ViewChild('headerContent', { static: true }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerFooter', { static: true }) headerFooter!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Danh sách tìm kiếm (bài viết)',
    desc: this.headerContent,
    breadcrumb: ['Home', 'Danh sách', 'mẫu yêu cầu'],
    footer: this.headerFooter
  };
  currentSelTab: number = 0;
  destroyRef = inject(DestroyRef);
  tabData: TabInterface[] = [
    { label: 'Bài viết', url: '/default/page-demo/list/search-list/article' },
    { label: 'Dự án', url: '/default/page-demo/list/search-list/project' },
    { label: 'Ứng dụng', url: '/default/page-demo/list/search-list/application' }
  ];

  constructor(private searchListService: SearchListStoreService, private activatedRoute: ActivatedRoute, private router: Router, private cdr: ChangeDetectorRef) {
    this.searchListService
      .getCurrentSearchListComponentStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(componentType => {
        this.pageHeaderInfo = {
          title: componentType,
          desc: this.headerContent,
          footer: this.headerFooter,
          breadcrumb: ['Home', 'Danh sách', componentType]
        };
        this.cdr.markForCheck();
      });
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(event => {
        if (event instanceof RouterEvent) {
          this.currentSelTab = this.tabData.findIndex(item => {
            return item.url === event.url;
          });
        }
      });
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key'];
  }

  to(item: TabInterface): void {
    this.router.navigateByUrl(item.url);
  }

  ngOnInit(): void {}
}
