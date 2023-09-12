import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ViewChild, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ModalBtnStatus } from '@widget/base-modal';
import { DragService } from '@widget/biz-widget/drag/drag.service';
import { ModalDragDirective } from '@widget/modal/modal-drag.directive';
import { NzModalWrapService } from '@widget/modal/nz-modal-wrap.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-ex-modal',
  templateUrl: './ex-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzButtonModule, NzWaveModule, NzModalModule, ModalDragDirective, CdkDrag, CdkDragHandle]
})
export class ExModalComponent implements OnInit {
  @ViewChild('dragTpl', { static: true }) dragTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Kéo Modal, cái cây sẽ được chuyển đến cái chết, và con người sẽ được chuyển đến sự sống.',
    breadcrumb: ['Home', 'kéo phương thức']
  };
  destroyRef = inject(DestroyRef);
  isVisible = false;
  isVisibleByDir = false;

  constructor(private dragService: DragService, private modalDragService: NzModalWrapService) {}

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.isVisibleByDir = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.isVisibleByDir = false;
  }

  showDailog1(): void {
    this.isVisible = true;
  }

  showDailogConfirm(): void {
    this.modalDragService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Nhắc nhở điều gì',
      nzOnOk: () => {
        console.log('Chắc chắn');
      },
      nzOnCancel: () => {
        console.log('Hủy bỏ');
      }
    });
  }

  showDailogInfo(): void {
    this.modalDragService.info({ nzTitle: 'Info', nzContent: 'Nhắc nhở điều gì' });
  }

  showDailogSuccess(): void {
    this.modalDragService.success({ nzTitle: 'Success', nzContent: 'Nhắc nhở điều gì' });
  }

  showDailogError(): void {
    this.modalDragService.error({ nzTitle: 'Error', nzContent: 'Nhắc nhở điều gì' });
  }

  showDailogWarning(): void {
    this.modalDragService.warning({ nzTitle: 'Warning', nzContent: 'Nhắc nhở điều gì' });
  }

  showDailog(): void {
    // hai lối
    // this.dragService.show({nzTitle: this.dragTpl, nzMask: false,nzMaskStyle:{display:'none'},nzWrapClassName:"pointer-events-none"}).subscribe(res=>console.log(res))
    this.dragService
      .show({
        nzTitle: 'Kéo tiêu đề',
        nzMask: false,
        nzMaskStyle: { display: 'none' },
        nzWrapClassName: 'pointer-events-none'
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ modalValue, status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }
        console.log(modalValue);
      });
  }

  ngOnInit(): void {}
}
