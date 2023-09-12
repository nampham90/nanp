import { ChangeDetectorRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LazySelPeopleEnum } from '@app/pages/comp/lazy/lazy-targ-comp/lazy-targ-comp.component';
import { AdDirective } from '@shared/directives/ad.directive';

@Injectable()
export class LazyServiceService {
  _adHost!: AdDirective;
  get adHost(): AdDirective {
    return this._adHost;
  }

  set adHost(value: AdDirective) {
    this._adHost = value;
  }

  constructor(public cdr: ChangeDetectorRef) {}

  async create(selPerson: LazySelPeopleEnum = LazySelPeopleEnum.YiLin): Promise<void> {
    await this.lazyLoadCard(selPerson);
    this.cdr.detectChanges();
  }

  async lazyLoadCard(selPerson: LazySelPeopleEnum = LazySelPeopleEnum.YiLin): Promise<void> {
    const viewContainerRef = this._adHost.viewContainerRef;
    const { LazyTargCompComponent } = await import('./lazy-targ-comp/lazy-targ-comp.component');
    const componentRef = viewContainerRef.createComponent(LazyTargCompComponent);
    // Có thể được quản lý bằng onchange hook bằng setInput api
    componentRef.setInput('purChoosePeople', selPerson);
    // vượt qua tham chiếu tiêu diệt
    componentRef.instance.currentPeople.pipe(takeUntilDestroyed(componentRef.instance.destroyRef)).subscribe(() => {
      this.create(componentRef.instance.purChoosePeople);
    });
    // Triển khai hook OnChange
    // (instance as any).ngOnChanges({
    //   purChoosePeople: new SimpleChange(null, instance.purChoosePeople, true)
    // });
  }
}
