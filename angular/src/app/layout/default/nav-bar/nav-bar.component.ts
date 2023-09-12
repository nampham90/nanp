import { DOCUMENT, NgIf, NgTemplateOutlet, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Inject, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, share, switchMap, tap } from 'rxjs/operators';

import { ThemeMode } from '@app/layout/default/setting-drawer/setting-drawer.component';
import { TabService } from '@core/services/common/tab.service';
import { Menu } from '@core/services/types';
import { AuthDirective } from '@shared/directives/auth.directive';
import { TrackByPropertyDirective } from '@shared/directives/track-by-property.directive';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnStopMouseEvent } from '@utils/tools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, NzMenuModule, NzNoAnimationModule, NgTemplateOutlet, NgFor, TrackByPropertyDirective, AuthDirective, NzButtonModule, NzIconModule, RouterLink, AsyncPipe]
})
export class NavBarComponent implements OnInit {
  @Input() isMixiHead = false; // Là chế độ kết hợp điều hướng trên cùng
  @Input() isMixiLeft = false;

  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();
  isCollapsed$ = this.themesService.getIsCollapsed();
  isOverMode$ = this.themesService.getIsOverMode();
  leftMenuArray$ = this.splitNavStoreService.getSplitLeftNavArrayStore();

  routerPath = this.router.url;
  themesMode: ThemeMode['key'] = 'side';
  isOverMode = false;
  isCollapsed = false;
  isMixiMode = false;
  leftMenuArray: Menu[] = [];
  menus: Menu[] = [];
  copyMenus: Menu[] = [];
  authCodeArray: string[] = [];
  subTheme$: Observable<any>;
  destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private userInfoService: UserInfoService,
    private menuServices: MenuStoreService,
    private splitNavStoreService: SplitNavStoreService,
    private activatedRoute: ActivatedRoute,
    private tabService: TabService,
    private cdr: ChangeDetectorRef,
    private themesService: ThemeService,
    private titleServe: Title,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.initMenus();

    this.subTheme$ = this.isOverMode$.pipe(
      switchMap(res => {
        this.isOverMode = res;
        return this.themesOptions$;
      }),
      tap(options => {
        this.themesMode = options.mode;
        this.isMixiMode = this.themesMode === 'mixi';
      }),
      share(),
      takeUntilDestroyed(this.destroyRef)
    );

    // Lắng nghe nguồn dữ liệu của menu bên trái trong chế độ kết hợp
    this.subMixiModeSideMenu();
    // Lắng nghe sự kiện gập/ mở rộng menu
    this.subIsCollapsed();
    this.subAuth();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.subTheme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            // Chuyển đổi chủ đề sang chế độ kết hợp, thiết lập nguồn dữ liệu cho menu bên trái
            //  Nếu đặt trong ngInit để lắng nghe, khi chế độ kết hợp, sau khi làm mới trang và chuyển đổi định tuyến, sẽ có runOutSideAngular
            if (this.isMixiMode) {
              this.setMixModeLeftMenu();
            }
          });
          // @ts-ignore
          this.routerPath = this.activatedRoute.snapshot['_routerState'].url;
          // Tạo một bản sao của menu (copyMenus) để ghi nhận trạng thái menu hiện tại, vì trong chế độ đầu trang không hiển thị menu con, tuy nhiên, khi chuyển đổi từ chế độ đầu trang sang chế độ thanh bên, cần phản ánh trạng thái menu trong chế độ đầu trang vào menu trong chế độ thanh bên
          this.clickMenuItem(this.menus);
          this.clickMenuItem(this.copyMenus);
          // Là menu được gập lại và không phải là menu đè lên, giải quyết lỗi khi gập menu bên trái, chuyển đổi tab sẽ có lỗi hiển thị menu trôi nổi
          if (this.isCollapsed && !this.isOverMode) {
            this.closeMenuOpen(this.menus);
          }

          // Chế độ menu đầu trang, không phải chế độ overlay, giải quyết lỗi hiển thị menu trôi nổi khi chuyển đổi tab
          if (this.themesMode === 'top' && !this.isOverMode) {
            this.closeMenu();
          }
        }),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => {
          return route.outlet === 'primary';
        }),
        mergeMap(route => {
          return route.data;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(routeData => {
        // Trang chi tiết có được mở dưới dạng tab mới hay không
        let isNewTabDetailPage = routeData['newTab'] === 'true';

        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }

        this.tabService.addTab(
          {
            snapshotArray: [route.snapshot],
            title: routeData['title'],
            path: this.routerPath
          },
          isNewTabDetailPage
        );
        this.tabService.findIndex(this.routerPath);
        // Từ Angular 16 trở đi, bạn có thể thiết lập tiêu đề trực tiếp trong định tuyến
        this.titleServe.setTitle(`${routeData['title']} - Ant Design`);
        // Khi ở chế độ kết hợp, khi chuyển đổi tab, menu bên trái cũng thay đổi tương ứng
        this.setMixModeLeftMenu();
      });
  }

  initMenus(): void {
    this.menuServices
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(menusArray => {
        this.menus = menusArray;
        this.copyMenus = this.cloneMenuArray(this.menus);
        this.clickMenuItem(this.menus);
        this.clickMenuItem(this.copyMenus);
        this.cdr.markForCheck();
      });
  }

  // Thiết lập nguồn dữ liệu cho chế độ kết hợp của menu bên trái với chế độ 'tự động phân tách menu
  setMixModeLeftMenu(): void {
    this.menus.forEach(item => {
      if (item.selected) {
        this.splitNavStoreService.setSplitLeftNavArrayStore(item.children || []);
      }
    });
  }

  // Sao chép sâu (deep clone) mảng menu
  cloneMenuArray(sourceMenuArray: Menu[], target: Menu[] = []): Menu[] {
    sourceMenuArray.forEach(item => {
      const obj: Menu = { menuName: '', menuType: 'C', path: '', id: -1, fatherId: -1 };
      for (let i in item) {
        if (item.hasOwnProperty(i)) {
          // @ts-ignore
          if (Array.isArray(item[i])) {
            // @ts-ignore
            obj[i] = this.cloneMenuArray(item[i]);
          } else {
            // @ts-ignore
            obj[i] = item[i];
          }
        }
      }
      target.push({ ...obj });
    });
    return target;
  }

  // rong chế độ kết hợp, khi nhấp vào menu cấp 1, hãy chọn menu con đầu tiên của menu cấp 1 đó
  changTopNav(index: number): void {
    // Đối tượng menu cấp 1 hiện đang được chọn
    const currentTopNav = this.menus[index];
    let currentLeftNavArray = currentTopNav.children || [];
    // Nếu menu cấp 1 có menu cấp 2
    if (currentLeftNavArray.length > 0) {
      //  Mảng menu dẫn bên trái hiện tại
      /*Thêm phiên bản có quyền hạn*/
      // Lấy tập hợp menu cấp 2 có quyền hạn (được hiển thị bên trái)
      currentLeftNavArray = currentLeftNavArray.filter(item => {
        return this.authCodeArray.includes(item.code!);
      });
      // Nếu menu cấp 2 đầu tiên không có menu cấp 3
      if (currentLeftNavArray.length > 0 && !currentLeftNavArray[0].children) {
        this.router.navigateByUrl(currentLeftNavArray[0].path!);
      } else if (currentLeftNavArray.length > 0 && currentLeftNavArray[0].children) {
        // Nếu có menu cấp 3, chuyển hướng đến menu cấp 3 đầu tiên
        this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      }
    }
    this.splitNavStoreService.setSplitLeftNavArrayStore(currentLeftNavArray);
  }

  flatMenu(menus: Menu[], routePath: string): void {
    menus.forEach(item => {
      item.selected = false;
      item.open = false;
      if (routePath.includes(item.path) && !item.newLinkFlag) {
        item.selected = true;
        item.open = true;
      }
      if (!!item.children && item.children.length > 0) {
        this.flatMenu(item.children, routePath);
      }
    });
  }

  clickMenuItem(menus: Menu[]): void {
    if (!menus) {
      return;
    }
    const index = this.routerPath.indexOf('?') === -1 ? this.routerPath.length : this.routerPath.indexOf('?');
    const routePath = this.routerPath.substring(0, index);
    this.flatMenu(menus, routePath);
    this.cdr.markForCheck();
  }

  // Thay đổi trạng thái hiển thị menu hiện tại
  changeOpen(currentMenu: Menu, allMenu: Menu[]): void {
    allMenu.forEach(item => {
      item.open = false;
    });
    currentMenu.open = true;
  }

  closeMenuOpen(menus: Menu[]): void {
    menus.forEach(menu => {
      menu.open = false;
      if (menu.children && menu.children.length > 0) {
        this.closeMenuOpen(menu.children);
      } else {
        return;
      }
    });
  }

  changeRoute(e: MouseEvent, menu: Menu): void {
    if (menu.newLinkFlag) {
      fnStopMouseEvent(e);
      window.open(menu.path, '_blank');
      return;
    }
    this.router.navigate([menu.path]);
  }

  // Lắng nghe sự kiện gấp menu
  subIsCollapsed(): void {
    this.isCollapsed$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(isCollapsed => {
      this.isCollapsed = isCollapsed;
      // Mở rộng menu
      if (!this.isCollapsed) {
        this.menus = this.cloneMenuArray(this.copyMenus);
        this.clickMenuItem(this.menus);
        // Trong chế độ kết hợp, cần nhấp vào nguồn dữ liệu menu bên trái ít nhất một lần, nếu không, khi menu có menu cấp 2 được mở rộng từ trạng thái gấp lại thành trạng thái mở, nó sẽ không mở
        if (this.themesMode === 'mixi') {
          this.clickMenuItem(this.leftMenuArray);
        }
      } else {
        // Thu gọn menu
        this.copyMenus = this.cloneMenuArray(this.menus);
        this.closeMenuOpen(this.menus);
      }
      this.cdr.markForCheck();
    });
  }

  closeMenu(): void {
    this.clickMenuItem(this.menus);
    this.clickMenuItem(this.copyMenus);
    this.closeMenuOpen(this.menus);
  }

  subAuth(): void {
    this.userInfoService
      .getUserInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => (this.authCodeArray = res.authCode));
  }

  // Lắng nghe nguồn dữ liệu menu bên trái trong chế độ kết hợp
  private subMixiModeSideMenu(): void {
    this.leftMenuArray$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.leftMenuArray = res;
    });
  }

  ngOnInit(): void {
    // Trong chế độ top, hãy đóng trạng thái mở của menu
    this.subTheme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(options => {
      if (options.mode === 'top' && !this.isOverMode) {
        this.closeMenu();
      }
    });
  }
}
