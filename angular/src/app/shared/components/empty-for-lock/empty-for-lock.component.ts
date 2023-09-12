import { Component, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { LockScreenFlag, LockScreenStoreService } from '@store/common-store/lock-screen-store.service';

/*Thành phần này tạo một trang trống nhằm giải quyết vấn đề f12 vẫn xem được trang ẩn khi màn hình khóa.*/

@Component({
  selector: 'app-empty-for-lock',
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class EmptyForLockComponent {
  // Trạng thái màn hình khóa bộ định tuyến
  routeStatus!: LockScreenFlag;
  destroyRef = inject(DestroyRef);

  constructor(private router: Router, private lockScreenStoreService: LockScreenStoreService) {
    this.lockScreenStoreService
      .getLockScreenStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.routeStatus = res;
      });
  }
}
