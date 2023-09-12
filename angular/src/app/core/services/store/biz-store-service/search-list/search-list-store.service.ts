import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

type componentName = 'Danh sách tìm kiếm (Bài viết)' | 'Danh sách tìm kiếm (Dự án)' | 'Danh sách tìm kiếm (Ứng dụng)';

// Đây là cửa hàng lưu trữ danh sách tìm kiếm và thuộc về cửa hàng doanh nghiệp.
@Injectable({
  providedIn: 'root'
})
export class SearchListStoreService {
  private SearchListComponentStore = new Subject<componentName>();

  constructor() {}

  setCurrentSearchListComponentStore(componentName: componentName): void {
    this.SearchListComponentStore.next(componentName);
  }

  getCurrentSearchListComponentStore(): Observable<componentName> {
    return this.SearchListComponentStore.asObservable();
  }
}
