import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ExampleService } from '@services/example/example.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzButtonModule, NzWaveModule]
})
export class SessionTimeoutComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Đăng nhập đã hết hạn',
    breadcrumb: ['Home', 'Chức năng', 'Đăng nhập đã hết hạn'],
    desc: 'Ví dụ hết hạn đăng nhập của người dùng. Nếu hết thời gian redis, hộp đăng nhập sẽ bật lên lần nữa. Nếu đăng nhập thành công, giao diện ban đầu sẽ được gửi lại. '+' Nếu đăng nhập thất bại, nó sẽ chuyển đến trang đăng nhập.'
  };
  destroyRef = inject(DestroyRef);

  constructor(private dataService: ExampleService) {}

  go(): void {
    this.dataService.sessionTimeOut().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  ngOnInit(): void {}
}
