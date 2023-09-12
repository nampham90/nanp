import { BreakpointObserver } from '@angular/cdk/layout';
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

/*Các thành phần không được hiển thị khi chiều rộng màn hình nhỏ hơn chiều rộng nhất định*/
@Directive({
  selector: '[appScreenLessHidden]',
  standalone: true
})
export class ScreenLessHiddenDirective {
  @Input('appScreenLessHidden')
  set appScreenLessHidden(lessScreen: string | undefined) {
    if (!lessScreen) {
      this.show(true);
      return;
    }
    this.breakpointObserver.observe([`(max-width: ${lessScreen}px)`]).subscribe(result => {
      if (result.matches) {
        this.show(false);
      } else {
        this.show(true);
      }
    });
  }

  constructor(private breakpointObserver: BreakpointObserver, private templateRef: TemplateRef<NzSafeAny>, private viewContainerRef: ViewContainerRef) {}

  private show(matched: boolean): void {
    matched ? this.viewContainerRef.createEmbeddedView(this.templateRef) : this.viewContainerRef.clear();
  }
}
