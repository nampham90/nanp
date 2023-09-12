import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { getDeepReuseStrategyKeyFn, fnGetPathWithoutParam } from '@utils/tools';
import _ from 'lodash';

import { SimpleReuseStrategy } from './reuse-strategy';
import { DatascStoreService } from '../store/common-store/datasc-store.service';
import { MenusService } from '../http/system/menus.service';
import { IObjectString } from '@app/common/IObiectString';

export interface TabModel {
  title: string;
  path: string;
  snapshotArray: ActivatedRouteSnapshot[];
}

/*
 * Dịch vụ vận hành tab
 * */
@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabArray$ = new BehaviorSubject<TabModel[]>([]);
  private tabArray: TabModel[] = [];
  private currSelectedIndexTab = 0;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute) {}

  getTabArray$(): Observable<TabModel[]> {
    return this.tabArray$.asObservable();
  }

  setTabArray$(tabArray: TabModel[]): void {
    this.tabArray$.next(tabArray);
  }

  setTabsSourceData(): void {
    this.setTabArray$(this.tabArray);
  }

  clearTabs(): void {
    this.tabArray = [];
    this.setTabsSourceData();
  }

  addTab(param: TabModel, isNewTabDetailPage = false): void {
    this.tabArray.forEach(tab => {
      // Liệt kê các thao tác chi tiết, chẳng hạn như chi tiết nhấp chuột vào biểu mẫu người dùng, mở chi tiết trong tab hiện tại, bạn có thể xem ví dụ trực tuyến: "Biểu mẫu truy vấn" và "Nút xem" trong biểu mẫu
      // tiêu đề cần phải giống với tiêu đề của lộ trình thành phần chi tiết biểu mẫu người dùng
      if (tab.title === param.title && !isNewTabDetailPage) {
       // Lưu ảnh chụp nhanh thành phần dưới mỗi tab vào mảng tab và thực hiện thao tác chống trùng lặp bên dưới
        tab.snapshotArray = _.uniqBy([...tab.snapshotArray, ...param.snapshotArray], item => {
          // @ts-ignore
          return item['_routerState'].url;
        });
        // Khi mở chi tiết trên trang hiện tại, bạn cần thay thế đường dẫn của tab tương ứng.
        tab.path = param.path;
      }
    });
    if (!this.tabArray.find(value => value.path === param.path)) {
      this.tabArray.push(param);
    }
    this.setTabsSourceData();
  }

  getTabArray(): TabModel[] {
    return this.tabArray;
  }

  changeTabTitle(title: string): void {
    this.tabArray[this.getCurrentTabIndex()].title = title;
    this.setTabArray$(this.tabArray);
  }

  // Xóa bộ đệm trong SimpleReuseStrategy.handlers trong ghép kênh tuyến theo khóa
  delReuseStrategy(snapshotArray: ActivatedRouteSnapshot[]): void {
    const beDeleteKeysArray = this.getSnapshotArrayKey(snapshotArray);
    // Mảng beDeleteKey lưu khóa của lộ trình liên quan để giải quyết vấn đề "khi tab hiện tại mở trang chi tiết" và "trên trang nào (trang danh sách hoặc trang chi tiết danh sách) nút đóng được nhấp, trang được nhấp (danh sách hoặc trang chi tiết). chi tiết trong trang danh sách), một trong số chúng) sẽ bị xóa và trang còn lại sẽ không bị xóa" lỗi
    beDeleteKeysArray.forEach(item => {
      SimpleReuseStrategy.deleteRouteSnapshot(item);
    });
  }

  // Theo ảnh chụp nhanh tuyến đường được lưu trong bộ nhớ đệm trong tab, hãy tạo khóa để sử dụng lại tuyến đường. Ví dụ: đăng nhập{name:'zhangsan'}, dạng khóa+param được lưu trữ trong SimpleReuseStrategy.handlers
  getSnapshotArrayKey(activatedArray: ActivatedRouteSnapshot[]): string[] {
    const temp: string[] = [];
    activatedArray.forEach(item => {
      const key = getDeepReuseStrategyKeyFn(item);
      temp.push(key);
    });
    return temp;
  }

  // Click chuột phải vào tab để loại bỏ tất cả các tab bên phải, Index là chỉ mục của tab được chọn bằng chuột.
  delRightTab(tabPath: string, index: number): void {
    // Nhận tab cần xóa
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex > index;
    });
    // Xóa toàn bộ tab bên phải tab chuột phải
    this.tabArray.length = index + 1;
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });
    // Nếu chỉ số của tab được chọn bằng chuột phải nhỏ hơn chỉ số của tab đang hiển thị thì tab đang mở cũng sẽ bị xóa.
    if (index < this.currSelectedIndexTab) {
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.router.navigateByUrl(this.tabArray[index].path);
    }
    this.setTabsSourceData();
  }

  // Nhấp chuột phải để xóa tất cả các tab bên trái
  /*
   * @params index Chỉ mục của tab nơi nút chuột hiện tại được nhấp vào
   * */
  delLeftTab(tabPath: string, index: number): void {
    // tab cần xóa
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex < index;
    });

    // Đầu tiên giải quyết mối quan hệ chỉ số
    if (this.currSelectedIndexTab === index) {
      this.currSelectedIndexTab = 0;
    } else if (this.currSelectedIndexTab < index) {
      // Nếu chỉ mục của tab được click chuột lớn hơn chỉ mục hiện tại, bạn cần đặt đường dẫn của trang hiện tại vào waitDelete
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.currSelectedIndexTab = 0;
    } else if (this.currSelectedIndexTab > index) {
      this.currSelectedIndexTab = this.currSelectedIndexTab - beDelTabArray.length;
    }
    // các tab còn lại
    this.tabArray = this.tabArray.splice(beDelTabArray.length);
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });
    this.setTabsSourceData();
    this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
  }

  // Nhấp chuột phải vào tab và chọn "Xóa các tab khác"
  delOtherTab(path: string, index: number): void {
    // tab cần xóa
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex !== index;
    });

    // Xử lý các tab sẽ được hiển thị
    this.tabArray = [this.tabArray[index]];
    // Xóa bộ nhớ đệm của tab cần xóa
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });

    // Nếu chỉ mục của tab được chọn bằng chuột không phải là chỉ mục của tab của trang hiện đang mở thì nên sử dụng key của trang hiện tại là waitDelete để ngăn các thành phần được hiển thị bởi tab hiện tại bị lưu vào bộ đệm sau khi bị xóa
    if (index !== this.currSelectedIndexTab) {
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
    }
    this.router.navigateByUrl(path);
    this.setTabsSourceData();
  }

  // Nhấp vào biểu tượng x trên nhãn tab để xóa tab hoặc nhấp chuột phải và nhấp vào hành động "Xóa tab hiện tại"
  delTab(tab: TabModel, index: number): void {
    //Xóa tab hiện đang hiển thị
    if (index === this.currSelectedIndexTab) {
      const seletedTabKey = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.tabArray.splice(index, 1);
      // Xử lý các mối quan hệ chỉ số
      this.currSelectedIndexTab = index - 1 < 0 ? 0 : index - 1;
      // Chuyển sang tab mới
      this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
      // Lưu đường dẫn hiện tại vào bộ nhớ cache-strategy.ts. Nếu đó là đường dẫn hiện tại, tuyến hiện tại sẽ không được lưu vào bộ đệm
      SimpleReuseStrategy.waitDelete = seletedTabKey;
    } else if (index < this.currSelectedIndexTab) {
      // Nếu chỉ mục tab được chọn bằng chuột nhỏ hơn chỉ mục tab hiện đang hiển thị, tức là tab được chọn bằng chuột nằm ở bên trái của tab hiện tại.
      this.tabArray.splice(index, 1);
      this.currSelectedIndexTab = this.currSelectedIndexTab - 1;
    } else if (index > this.currSelectedIndexTab) {
      //Xóa tab bên phải tab hiện tại
      this.tabArray.splice(index, 1);
    }
    // Thao tác này giải quyết vấn đề lưu trạng thái của hai trang, chẳng hạn như trang danh sách với trang chi tiết và trang danh sách và trang chi tiết.
    // Lỗi về trạng thái tab đã đóng của trang hiện tại
    // Xóa ảnh chụp nhanh được lưu trong bộ nhớ cache của tab đã chọn
    this.delReuseStrategy(tab.snapshotArray);
    this.setTabsSourceData();
  }

  findIndex(path: string): number {
    const current = this.tabArray.findIndex(tabItem => {
      return path === tabItem.path;
    });
    this.currSelectedIndexTab = current;
    return current;
  }

  getCurrentPathWithoutParam(urlSegmentArray: UrlSegment[], queryParam: { [key: string]: any }): string {
    const temp: string[] = [];
    // Lấy giá trị của tất cả các tham số
    const queryParamValuesArray = Object.values(queryParam);
    urlSegmentArray.forEach(urlSeqment => {
      // Xóa đoạn url đại diện cho các tham số
      if (!queryParamValuesArray.includes(urlSeqment.path)) {
        temp.push(urlSeqment.path);
      }
    });
    return `${temp.join('/')}`;
  }

  // để làm mới
  refresh(): void {
    // Nhận ảnh chụp nhanh định tuyến hiện tại
    let snapshot = this.activatedRoute.snapshot;
    const key = getDeepReuseStrategyKeyFn(snapshot);
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    let params: Params;
    let urlWithOutParam = ''; // Đây là url không có tham số
    // Đó là một tuyến truyền các tham số dọc theo đường dẫn và có các tham số.
    if (Object.keys(snapshot.params).length > 0) {
      params = snapshot.params;
      // @ts-ignore
      urlWithOutParam = this.getCurrentPathWithoutParam(snapshot['_urlSegment'].segments, params);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([urlWithOutParam, ...Object.values(params)]);
      });
    } else {
      // Đó là tuyến truyền tham số cho truy vấn hoặc tuyến không có tham số.
      params = snapshot.queryParams;
      const sourceUrl = this.router.url;
      const currentRoute = fnGetPathWithoutParam(sourceUrl);
      //Đó là tham số truy vấn
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([currentRoute], { queryParams: params });
      });
    }
  }

  getCurrentTabIndex(): number {
    return this.currSelectedIndexTab;
  }
}
