import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

import { ScrollService } from '@core/services/common/scroll.service';
import { ThemeService } from '@store/common-store/theme.service';
import { fnGetReuseStrategyKeyFn, getDeepReuseStrategyKeyFn } from '@utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

export type ReuseHookTypes = '_onReuseInit' | '_onReuseDestroy';

export interface ReuseComponentInstance {
  _onReuseInit: () => void;
  _onReuseDestroy: () => void;
}

export interface ReuseComponentRef {
  instance: ReuseComponentInstance;
}

/*Ghép kênh định tuyến*/
// tham khảo https://zhuanlan.zhihu.com/p/29823560
// https://blog.csdn.net/weixin_30561425/article/details/96985967?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control
export class SimpleReuseStrategy implements RouteReuseStrategy {
  destroyRef = inject(DestroyRef);
// Lưu trữ bản đồ của từng thành phần
  static handlers: { [key: string]: NzSafeAny } = {};
// Cache vị trí cuộn của mỗi trang, tại sao không đặt nó vào bộ xử lý, vì khi tuyến rời đi, việc sử dụng lại tuyến khiến trang hiện tại làm khóa bị rỗng
  static scrollHandlers: { [key: string]: NzSafeAny } = {};

// Mục đích của tham số này là click vào nút xóa trong tab hiện tại, mặc dù tab đã bị đóng nhưng khi Route rời đi, các thành phần của tab đã đóng sẽ vẫn được lưu vào bộ đệm.
  // Sử dụng tham số này để ghi lại xem tuyến đường hiện tại có cần được lưu vào bộ đệm hay không
  public static waitDelete: string | null;

  //Cho dù có nhiều tab hay không, nếu không có nhiều tab, bộ nhớ đệm tuyến đường sẽ không được thực hiện.
  isShowTab$ = inject(ThemeService).getThemesMode();

  public static deleteRouteSnapshot(key: string): void {
    if (SimpleReuseStrategy.handlers[key]) {
      if (SimpleReuseStrategy.handlers[key].componentRef) {
        SimpleReuseStrategy.handlers[key].componentRef.destroy();
      }
      delete SimpleReuseStrategy.handlers[key];
      delete SimpleReuseStrategy.scrollHandlers[key];
    }
  }

  // Xóa tất cả bộ đệm, nó cần được sử dụng trong các hoạt động như đăng xuất và không sử dụng đa nhãn
  public static deleteAllRouteSnapshot(route: ActivatedRouteSnapshot): Promise<void> {
    return new Promise(resolve => {
      Object.keys(SimpleReuseStrategy.handlers).forEach(key => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
      });
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(route);
      resolve();
    });
  }

  constructor(@Inject(DOCUMENT) private doc: Document, private scrollService: ScrollService) {}

  // Có cho phép sử dụng lại tuyến đường hay không
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Có hiển thị nhiều tab hay không, nếu không, việc sử dụng lại tuyến đường sẽ không được thực hiện
    let isShowTab = false;
    this.isShowTab$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      isShowTab = res.isShowTab;
    });
    return route.data['shouldDetach'] !== 'no' && isShowTab;
  }

  // Được kích hoạt khi tuyến rời đi, tuyến được lưu trữ
  store(route: ActivatedRouteSnapshot, handle: NzSafeAny): void {
    if (route.data['shouldDetach'] === 'no') {
      return;
    }
    const key = fnGetReuseStrategyKeyFn(route);
    // Nếu tuyến đường cần xóa là tuyến đường hiện tại thì ảnh chụp nhanh sẽ không được lưu trữ.
    if (SimpleReuseStrategy.waitDelete === key) {
      this.runHook('_onReuseDestroy', handle.componentRef);
      handle.componentRef.destroy();
      SimpleReuseStrategy.waitDelete = null;
      delete SimpleReuseStrategy.scrollHandlers[key];
      return;
    }

// Cache vị trí cuộn của trang hiện tại khi rời khỏi tuyến đường
    // Theo mặc định, keepScroll là bắt buộc. Nếu không cần keepScroll, hãy thêm thuộc tính needKeepScroll:no
    const innerScrollContainer = [];
    if (route.data['needKeepScroll'] !== 'no') {
      const scrollContain = route.data['scrollContain'] ?? [];
      scrollContain.forEach((item: string) => {
        const el = this.doc.querySelector(item)!;
        if (el) {
          const position = this.scrollService.getScrollPosition(el);
          innerScrollContainer.push({ [item]: position });
        }
      });
      innerScrollContainer.push({ window: this.scrollService.getScrollPosition() });
    }

    SimpleReuseStrategy.scrollHandlers[key] = { scroll: innerScrollContainer };
    SimpleReuseStrategy.handlers[key] = handle;

    if (handle && handle.componentRef) {
      this.runHook('_onReuseDestroy', handle.componentRef);
    }
  }

  // Có cho phép khôi phục tuyến đường hay không
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const key = fnGetReuseStrategyKeyFn(route);
    return !!key && !!SimpleReuseStrategy.handlers[key];
  }

  // Nhận lộ trình lưu trữ
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const key = fnGetReuseStrategyKeyFn(route);
    return !key ? null : SimpleReuseStrategy.handlers[key];
  }

  // Trình kích hoạt tuyến đường đến, khi đó là cùng một tuyến đường, tuyến đường đó được ghép kênh
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    const futureKey = fnGetReuseStrategyKeyFn(future);
    const currKey = fnGetReuseStrategyKeyFn(curr);
    if (!!futureKey && SimpleReuseStrategy.handlers[futureKey]) {
      this.runHook('_onReuseInit', SimpleReuseStrategy.handlers[futureKey].componentRef);
    }

    const result = futureKey === currKey;
    // Tải chậm không thể đọc dữ liệu. Hãy sử dụng phương pháp này để đi sâu vào lộ trình cấp thấp nhất.
    while (future.firstChild) {
      future = future.firstChild;
    }
    // Việc mua lại là do tương lai đã thay đổi trong vòng lặp while ở trên
    const scrollFutureKey = fnGetReuseStrategyKeyFn(future);
    if (!!scrollFutureKey && SimpleReuseStrategy.scrollHandlers[scrollFutureKey]) {
      SimpleReuseStrategy.scrollHandlers[scrollFutureKey].scroll.forEach((elOptionItem: { [key: string]: [number, number] }) => {
        Object.keys(elOptionItem).forEach(element => {
          setTimeout(() => {
            this.scrollService.scrollToPosition(this.doc.querySelector(element), elOptionItem[element]);
          }, 1);
        });
      });
    }
    return result;
  }

  runHook(method: ReuseHookTypes, comp: ReuseComponentRef): void {
    const compThis = comp.instance;
    if (comp == null || !compThis) {
      return;
    }
    const fn = compThis[method];
    if (typeof fn !== 'function') {
      return;
    }
    (fn as () => void).call(compThis);
  }
}
