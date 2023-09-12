import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, NzButtonModule, NzWaveModule, NzDropDownModule, NzMenuModule]
})
export class ContextMenuComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ về menu chuột phải',
    breadcrumb: ['Home', 'Chức năng', 'menu chuột phải'],
    desc: 'Không có gì, ví dụ về trang web chính thức của zorro để xử lý'
  };
  constructor(private nzContextMenuService: NzContextMenuService) {}

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }
  ngOnInit(): void {}
}
