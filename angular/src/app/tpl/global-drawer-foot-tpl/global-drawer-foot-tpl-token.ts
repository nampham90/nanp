// https://netbasal.com/getting-to-know-the-createcomponent-api-in-angular-22fb115f08e2
// https://angular.io/api/core/createComponent
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, InjectionToken, TemplateRef } from '@angular/core';

import { GlobalDrawerFootTplComponent } from '@app/tpl/global-drawer-foot-tpl/global-drawer-foot-tpl.component';
import { GlobalModalBtnTplComponent } from '@app/tpl/global-modal-btn-tpl/global-modal-btn-tpl.component';

/**
 * Mẫu chân trang của ngăn kéo chung, tức là các nút OK và Hủy
 */
export const GLOBAL_DRAWER_FOOT_TPL_TOKEN = new InjectionToken<ComponentRef<GlobalDrawerFootTplComponent>>('drawer action btn token', {
  providedIn: 'root',
  factory: () => {
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    const componentRef = createComponent(GlobalDrawerFootTplComponent, {
      environmentInjector: injector
    });
    // Đăng ký tham chiếu mới được tạo với phiên bản `ApplicationRef` để đưa chế độ xem thành phần vào chu trình phát hiện thay đổi.
    appRef.attachView(componentRef.hostView);
    return componentRef;
  }
});
