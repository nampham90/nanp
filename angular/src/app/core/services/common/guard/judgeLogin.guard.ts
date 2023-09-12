import { assertInInjectionContext, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { TokenKey } from '@config/constant';

import { WindowService } from '../window.service';

// Những ai quan tâm có thể xem tranh cãi giữa class và fn https://github.com/angular/angular/pull/47924
// Ở đây tôi cung cấp một cách viết khác JudgeAuth.guard.ts để bạn tham khảo. Bạn cũng có thể vào trang web chính thức để tìm api mapToCanActivate.
// Routing Guard, nếu không có TokenKey thì nhảy tới trang đăng nhập
const canActivateChildFn: CanActivateFn = () => {
  // Phương pháp này có thể kiểm tra xem liệu tiêm có trong ngữ cảnh hay không
  assertInInjectionContext(canActivateChildFn);
  const windowSrc = inject(WindowService);
  const router = inject(Router);

  const isLogin = !!windowSrc.getSessionStorage(TokenKey);
  if (isLogin) {
    return true;
  }
  return router.parseUrl('/login');
};

export const JudgeLoginGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return canActivateChildFn(childRoute, state);
};
