import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { takeUntil } from 'rxjs/operators';

import { ip } from '@env/environment.prod';
import { DownloadService } from '@services/download/download.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import FileSaver from 'file-saver';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, NzButtonModule, NzWaveModule]
})
export class DownloadComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Tải tài liệu',
    breadcrumb: ['Home', 'CHức năng', 'Tải tài liệu'],
    desc: 'Tải tập tin khác nhau'
  };
  destroyRef = inject(DestroyRef);

  constructor(private downloadService: DownloadService) {}

  ngOnInit(): void {}

  fileStreamDownload(): void {
    const downloadDto = {
      downloadUrl: `http://${ip}/api/file/Mẫu nhập số lượng vật liệu thực tế vào bản vẽ.xlsx`
    };
    this.downloadService
      .fileStreamDownload(downloadDto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        const blob = new Blob([res], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, 'Mẫu nhập thư viện tài liệu.xlsx');
      });
  }
}
