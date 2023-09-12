import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ModalWrapService } from '@widget/base-modal';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ModalOptions } from 'ng-zorro-antd/modal';
import { YoutubeComponent } from './youtube.component';

@Injectable({
  providedIn: 'root'
})
export class YoutubeModalService {
  constructor(private modalWrapService: ModalWrapService) {}
  protected getContentComponent(): NzSafeAny {
    return YoutubeComponent;
  }

  public show(modalOptions: ModalOptions = {}, params?: object): Observable<NzSafeAny> {
    return this.modalWrapService.show(this.getContentComponent(), modalOptions, params);
  }
}