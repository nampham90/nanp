import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, NzButtonModule, NzInputModule, FormsModule, NzWaveModule, ClipboardModule]
})
export class CopyComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Ví dụ sao chép văn bản',
    breadcrumb: ['Home', 'Chức năng', 'bìa kẹp hồ sơ']
  };
  value = '';

  constructor(private msg: NzMessageService) {}

  info(): void {
    this.msg.success('Sao chép thành công, dán trực tiếp');
  }

  ngOnInit(): void {}
}
