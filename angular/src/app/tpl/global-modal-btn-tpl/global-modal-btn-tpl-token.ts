// https://netbasal.com/getting-to-know-the-createcomponent-api-in-angular-22fb115f08e2
// https://angular.io/api/core/createComponent
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, inject, InjectionToken } from '@angular/core';

import { GlobalModalBtnTplComponent } from '@app/tpl/global-modal-btn-tpl/global-modal-btn-tpl.component';

/**
 * Ở góc trên bên phải của hộp thoại chung, hãy mở rộng mẫu hàm tối đa hóa
 */
export const GLOBAL_TPL_MODAL_ACTION_TOKEN = new InjectionToken<ComponentRef<GlobalModalBtnTplComponent>>('modal action btn token', {
  providedIn: 'root',
  factory: () => {
    const appRef = inject(ApplicationRef);
    const injector = inject(EnvironmentInjector);

    const componentRef = createComponent(GlobalModalBtnTplComponent, {
      environmentInjector: injector
    });
    // Đăng ký tham chiếu mới được tạo với phiên bản `ApplicationRef` để đưa chế độ xem thành phần vào chu trình phát hiện thay đổi.
    appRef.attachView(componentRef.hostView);
    return componentRef;
  }
});
