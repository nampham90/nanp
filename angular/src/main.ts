import { DOCUMENT, registerLocaleData } from '@angular/common';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import vi from '@angular/common/locales/vi';
import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, RouteReuseStrategy, withComponentInputBinding, withHashLocation, withInMemoryScrolling, withPreloading } from '@angular/router';

import { MenuFoldOutline, MenuUnfoldOutline, FormOutline, DashboardOutline } from '@ant-design/icons-angular/icons';
import { appRoutes } from '@app/app-routing';
import { AppComponent } from '@app/app.component';
import interceptors from '@app/core/services/interceptors';
import { InitThemeService } from '@core/services/common/init-theme.service';
import { LoadAliIconCdnService } from '@core/services/common/load-ali-icon-cdn.service';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { ScrollService } from '@core/services/common/scroll.service';
import { SelectivePreloadingStrategyService } from '@core/services/common/selective-preloading-strategy.service';
import { SubLockedStatusService } from '@core/services/common/sub-locked-status.service';
import { SubWindowWithService } from '@core/services/common/sub-window-with.service';
import { ThemeSkinService } from '@core/services/common/theme-skin.service';
import { StartupService } from '@core/startup/startup.service';
import { environment } from '@env/environment';
import { NzDrawerServiceModule } from 'ng-zorro-antd/drawer';
import { NZ_I18N, vi_VN } from 'ng-zorro-antd/i18n';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NzMessageServiceModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];

registerLocaleData(vi);

export function StartupServiceFactory(startupService: StartupService) {
  return () => startupService.load();
}

export function LoadAliIconCdnFactory(loadAliIconCdnService: LoadAliIconCdnService) {
  return () => loadAliIconCdnService.load();
}

export function InitThemeServiceFactory(initThemeService: InitThemeService) {
  return async () => await initThemeService.initTheme();
}

export function InitLockedStatusServiceFactory(subLockedStatusService: SubLockedStatusService) {
  return () => subLockedStatusService.initLockedStatus();
}

export function SubWindowWithServiceFactory(subWindowWithService: SubWindowWithService) {
  return () => subWindowWithService.subWindowWidth();
}

const APPINIT_PROVIDES = [
  // Khởi động dự án
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true
  },
   // Tải thư viện biểu tượng của Alibaba từ CDN
  {
    provide: APP_INITIALIZER,
    useFactory: LoadAliIconCdnFactory,
    deps: [LoadAliIconCdnService],
    multi: true
  },
 // Khởi tạo dịch vụ khóa màn hình
  {
    provide: APP_INITIALIZER,
    useFactory: InitLockedStatusServiceFactory,
    deps: [SubLockedStatusService],
    multi: true
  },
  // Khởi tạo chủ đề
  {
    provide: APP_INITIALIZER,
    useFactory: InitThemeServiceFactory,
    deps: [InitThemeService],
    multi: true
  },
  // Khởi tạo dịch vụ theo dõi độ rộng màn hình
  {
    provide: APP_INITIALIZER,
    useFactory: SubWindowWithServiceFactory,
    deps: [SubWindowWithService],
    multi: true
  },
  // Khởi tạo CSS cho chế độ tối hoặc chế độ mặc định "
  {
    provide: APP_INITIALIZER,
    useFactory: (themeService: ThemeSkinService) => () => {
      return themeService.loadTheme();
    },
    deps: [ThemeSkinService],
    multi: true
  }
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy, deps: [DOCUMENT, ScrollService] },
    { provide: NZ_I18N, useValue: vi_VN },
    { provide: NZ_ICONS, useValue: icons },
    provideRouter(
      appRoutes,
      withPreloading(SelectivePreloadingStrategyService),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top'
      }),
      withHashLocation(),
      withComponentInputBinding() // Kích hoạt ràng buộc tham số định tuyến vào thuộc tính đầu vào của thành phần, tính năng mới trong ng16
    ),
    importProvidersFrom(NzMessageServiceModule, NzDrawerServiceModule, NzModalModule),
    ...interceptors,
    ...APPINIT_PROVIDES,
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi())
  ]
}).catch(err => console.error(err));
