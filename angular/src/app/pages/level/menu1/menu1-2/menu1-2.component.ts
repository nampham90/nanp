import { NgFor } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { NumberLoopPipe } from '@shared/pipes/number-loop.pipe';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-menu1-2',
  templateUrl: './menu1-2.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzInputModule, NgFor, NumberLoopPipe]
})
export class Menu12Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
