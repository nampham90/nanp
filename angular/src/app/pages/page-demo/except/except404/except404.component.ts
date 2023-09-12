import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-except404',
  template: `
    <nz-result nzStatus="404" nzSubTitle="Sorry, the page you visited does not exist." nzTitle="404">
      <div nz-result-extra>
        <button nz-button (click)="backHome()" nzType="primary">Back Home</button>
      </div>
    </nz-result>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzResultModule, NzButtonModule, NzWaveModule]
})
export class Except404Component implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  backHome() : void {
    this.router.navigateByUrl('/login/login-form');
  }
}
