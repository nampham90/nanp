import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Theme, ThemeMode } from '@app/layout/default/setting-drawer/setting-drawer.component';

export interface SettingInterface {
  theme: Theme['key']; //Chế độ chủ đề (chế độ tối, chế độ sáng)
  color: string; // Màu chủ đề
  mode: ThemeMode['key']; // Chế độ menu (chế độ bên, chế độ trên cùng, chế độ hỗn hợp)
  colorWeak: boolean; // điểm yếu màu sắc
  greyTheme: boolean; //  chế độ màu xám
  fixedHead: boolean; // đầu cố định
  splitNav: boolean; // Có chia menu hay không (chỉ hợp lệ khi chế độ menu là chế độ hỗn hợp)
  fixedLeftNav: boolean; // Đã sửa lỗi menu bên trái
  isShowTab: boolean; //Có hiển thị nhiều tab hay không
  fixedTab: boolean; // Trang tab cố định
  hasTopArea: boolean; // Có hiển thị khu vực trên cùng hay không
  hasFooterArea: boolean; // Có hiển thị khu vực phía dưới không
  hasNavArea: boolean; // Có thực đơn không
  hasNavHeadArea: boolean; // Menu có tiêu đề menu không?
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isNightTheme$ = new BehaviorSubject<boolean>(false);
  private isOverModeTheme$ = new BehaviorSubject<boolean>(false);
  private themesMode$ = new BehaviorSubject<SettingInterface>({
    theme: 'dark',
    color: '#1890FF',
    mode: 'side',
    isShowTab: true,
    colorWeak: false,
    greyTheme: false,
    splitNav: false,
    fixedTab: true,
    fixedHead: true,
    fixedLeftNav: true,
    hasTopArea: true,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true
  });

  private isCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  // Nhận thông số chủ đề
  setThemesMode(mode: SettingInterface): void {
    this.themesMode$.next(mode);
  }

  getThemesMode(): Observable<SettingInterface> {
    return this.themesMode$.asObservable();
  }

  // Chủ đề có phải là chủ đề tối không
  setIsNightTheme(isNight: boolean): void {
    this.isNightTheme$.next(isNight);
  }

  getIsNightTheme(): Observable<boolean> {
    return this.isNightTheme$.asObservable();
  }

  // Liệu chủ đề có ở trên thanh bên hay không
  setIsOverMode(isNight: boolean): void {
    this.isOverModeTheme$.next(isNight);
  }

  getIsOverMode(): Observable<boolean> {
    return this.isOverModeTheme$.asObservable();
  }

  // Menu có bị thu gọn hay không
  setIsCollapsed(isCollapsed: boolean): void {
    this.isCollapsed$.next(isCollapsed);
  }

  getIsCollapsed(): Observable<boolean> {
    return this.isCollapsed$.asObservable();
  }
}
