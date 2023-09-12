import { Injectable } from '@angular/core';
import { ModalWrapService } from '@app/widget/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { SubdemoComponent } from './subdemo.component';

@Injectable({
  providedIn: 'root'
})
export class SubdemoService {

  constructor(private modalWrapService: ModalWrapService) {}
  protected getContentComponent(): NzSafeAny {
    return SubdemoComponent;
  }

  public show(modalOptions: ModalOptions = {}, params?: object): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, params);
  }
}
