import { BreakpointObserver } from '@angular/cdk/layout';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';

import { SideCollapsedMaxWidth, TopCollapsedMaxWidth } from '@config/constant';
import { ThemeService } from '@store/common-store/theme.service';
import { EquipmentWidth, WindowsWidthService } from '@store/common-store/windows-width.service';

/*Dịch vụ giám sát chiều rộng màn hình*/
@Injectable({
  providedIn: 'root'
})
export class SubWindowWithService {
  subWidthObj: { [key: string]: [EquipmentWidth, [number, number]] } = {
    '(max-width: 575.98px)': [EquipmentWidth.xs, [0, 575.98]],
    '(min-width: 576px) and (max-width: 767.98px)': [EquipmentWidth.sm, [576, 767.98]],
    '(min-width: 768px) and (max-width: 991.98px)': [EquipmentWidth.md, [768, 991.98]],
    '(min-width: 992px) and (max-width: 1199.98px)': [EquipmentWidth.lg, [992, 1199.98]],
    '(min-width: 1200px) and (max-width: 1599.98px)': [EquipmentWidth.xl, [1200, 1599.98]],
    '(min-width: 1600px)': [EquipmentWidth.xxl, [1600, 9999]]
  };
  destroyRef = inject(DestroyRef);

  constructor(private winWidthService: WindowsWidthService, private breakpointObserver: BreakpointObserver, private themesService: ThemeService) {}

  // Theo dõi chủ đề (trên cùng hoặc bên cạnh) và xác định độ rộng tối thiểu của chế độ trên
  subWidthForTheme(): void {
    this.themesService
      .getThemesMode()
      .pipe(
        switchMap(res => {
          let maxWidth = '';
          if (res.mode === 'side' || (res.mode === 'mixi' && !res.splitNav)) {
            maxWidth = `(max-width: ${SideCollapsedMaxWidth}px)`;
          } else if (res.mode === 'top' || (res.mode === 'mixi' && res.splitNav)) {
            maxWidth = `(max-width: ${TopCollapsedMaxWidth}px)`;
          }
          // Bạn có thể nhập thông số [Breakpoints.Small, Breakpoints.XSmall]
          return this.breakpointObserver.observe([maxWidth]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => {
        const isOverMode = result.matches;
        this.themesService.setIsOverMode(isOverMode);
        // Đã hết chế độ, mở rộng menu bên trái ở trạng thái gập
        if (isOverMode) {
          this.themesService.setIsCollapsed(false);
        }
      });
  }

  // Xác định nút lưới nào dựa trên chiều rộng màn hình đến
  judgeWindowsWidth(width: number): EquipmentWidth {
    let currentPoint: EquipmentWidth;
    Object.values(this.subWidthObj).forEach(item => {
      if (width >= item[1][0] && width <= item[1][1]) {
        currentPoint = item[0];
      }
    });
    return currentPoint!;
  }

  // Lắng nghe độ rộng trình duyệt cho một hệ thống lưới chung
  subWidthForStore(): void {
    this.breakpointObserver
      .observe(Object.keys(this.subWidthObj))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        Object.keys(res.breakpoints).forEach(item => {
          if (res.breakpoints[item]) {
            this.winWidthService.setWindowWidthStore(this.subWidthObj[item][0]);
          }
        });
      });
  }

  subWindowWidth(): void {
    this.subWidthForTheme();
    this.subWidthForStore();
    // Đặt nút hiện tại trong quá trình khởi tạo
    this.winWidthService.setWindowWidthStore(this.judgeWindowsWidth(window.innerWidth));
  }
}
