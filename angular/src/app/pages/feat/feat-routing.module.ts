import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'ex-modal', pathMatch: 'full' },
  { path: 'ex-modal', data: { title: 'Kéo phương thức', key: 'ex-modal' }, loadComponent: () => import('./ex-modal/ex-modal.component').then(m => m.ExModalComponent) },
  { path: 'ex-drawer', data: { title: 'Ngăn kéo đóng gói', key: 'ex-drawer' }, loadComponent: () => import('./ex-drawer/ex-drawer.component').then(m => m.ExDrawerComponent) },
  { path: 'msg', data: { title: 'thông báo', key: 'msg' }, loadComponent: () => import('./msg/msg.component').then(m => m.MsgComponent) },
  { path: 'frame', loadChildren: () => import('./frame/frame-routing') },
  { path: 'rich-text', data: { title: 'văn bản phong phú', key: 'rich-text' }, loadComponent: () => import('./rich-text/rich-text.component').then(m => m.RichTextComponent) },
  { path: 'upload', data: { title: 'Tải lên tệp', key: 'upload' }, loadComponent: () => import('./upload/upload.component').then(m => m.UploadComponent) },
  {
    path: 'context-menu',
    data: { title: 'menu chuột phải', key: 'context-menu' },
    loadComponent: () => import('./context-menu/context-menu.component').then(m => m.ContextMenuComponent)
  },
  {
    path: 'session-timeout',
    data: { title: 'Đăng nhập đã hết hạn', key: 'session-timeout' },
    loadComponent: () => import('./session-timeout/session-timeout.component').then(m => m.SessionTimeoutComponent)
  },
  {
    path: 'click-out-side',
    data: { title: 'clickOutSide', key: 'click-out-side' },
    loadComponent: () => import('./click-out-side/click-out-side.component').then(m => m.ClickOutSideComponent)
  },
  { path: 'color-sel', data: { title: 'bộ chọn màu', key: 'color-sel' }, loadComponent: () => import('./color-sel/color-sel.component').then(m => m.ColorSelComponent) },
  { path: 'scroll', loadChildren: () => import('./scroll/scroll-routing.module') },
  { path: 'img-preview', data: { title: 'Xem trước hình ảnh', key: 'img-preview' }, loadComponent: () => import('./img-preview/img-preview.component').then(m => m.ImgPreviewComponent) },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs-routing') },
  { path: 'websocket', data: { title: 'kiểm tra ổ cắm web', key: 'websocket' }, loadComponent: () => import('./websocket/websocket.component').then(m => m.WebsocketComponent) },
  { path: 'full-screen', data: { title: 'toàn màn hình', key: 'full-screen' }, loadComponent: () => import('./full-screen/full-screen.component').then(m => m.FullScreenComponent) },
  { path: 'icons', data: { title: 'Icon', key: 'icons' }, loadComponent: () => import('./icons/icons.component').then(m => m.IconsComponent) },
  { path: 'charts', loadChildren: () => import('./charts/charts-routing') },
  { path: 'ripple', data: { title: 'gợn nước', key: 'ripple' }, loadComponent: () => import('./ripple/ripple.component').then(m => m.RippleComponent) },
  { path: 'copy', data: { title: 'bìa kẹp hồ sơ', key: 'copy' }, loadComponent: () => import('./copy/copy.component').then(m => m.CopyComponent) },
  { path: 'setup', data: { title: 'Trang hướng dẫn', key: 'setup' }, loadComponent: () => import('./setup/setup.component').then(m => m.SetupComponent) },
  { path: 'download', data: { title: 'Tải tài liệu', key: 'download' }, loadComponent: () => import('./download/download.component').then(m => m.DownloadComponent) }
] as Route[];
