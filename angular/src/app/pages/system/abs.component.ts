import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { IObjectString } from '@app/common/IObiectString';
import { HuongdanService } from '@app/core/services/http/system/huongdan.service';
import { MenusService } from '@app/core/services/http/system/menus.service';
import { SpinService } from '@app/core/services/store/common-store/spin.service';
import { PageHeaderComponent, PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { ModalBtnStatus } from '@app/widget/base-modal';
import { YoutubeModalService } from '@app/widget/biz-widget/system/youtube-modal/youtube.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-abs',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent]
})
export class AbsComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  formItemNm: IObjectString = {};

  @ViewChild('huongdanTpl', { static: true }) huongdanTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: ['', '', ''],
    extra: this.huongdanTpl
  };

  constructor(protected cdr: ChangeDetectorRef, protected spinService: SpinService, protected dataService: HuongdanService, protected youtubeModalService: YoutubeModalService, protected router: Router, protected menusService: MenusService) {}

  ngOnInit(): void {
    this.formItemName();
  }

  showVideo(): void {
    const path = this.router.url;
    this.dataService
      .getIdyoutube(path)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(idyoutube => {
        this.youtubeModalService.show({ nzTitle: 'Hướng dẫn sử dụng' }, { showcomfirm: false, idvideo: idyoutube }).subscribe(res => {
          if (!res || res.status === ModalBtnStatus.Cancel) {
            return;
          }
        });
      });
  }

  formItemName(): void {
    this.spinService.setCurrentGlobalSpinStore(true);
    const path = this.router.url;
    this.menusService.getMenuDetailFromUrl(path).subscribe(list => {
      
      list.forEach(item => {
        this.formItemNm[item.stt] = item.title1;
      });
      this.pageHeaderInfo = {
        title: this.formItemNm[2],
        breadcrumb: [this.formItemNm[1], this.formItemNm[7], this.formItemNm[2]],
        extra: this.huongdanTpl
      };
      this.cdr.markForCheck();
      this.spinService.setCurrentGlobalSpinStore(false);
    });
  }
}
