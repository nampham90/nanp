import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Dịch vụ dùng để lưu trữ xem hộp thoại có ở trạng thái toàn màn hình hay không
 * Ngay cả khi nhiều hộp thoại được mở, chỉ có thể tồn tại một hộp thoại toàn màn hình cùng một lúc.
 *
 */
@Injectable({
  providedIn: 'root'
})
export class ModalFullStatusStoreService {
  private modalFullStatusStore$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  setModalFullStatusStore(store: boolean): void {
    this.modalFullStatusStore$.next(store);
  }

  getModalFullStatusStore(): Observable<boolean> {
    return this.modalFullStatusStore$.asObservable();
  }
}
