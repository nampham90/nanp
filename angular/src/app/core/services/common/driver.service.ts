import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import Driver from 'driver.js';
/*
 * https://madewith.cn/766
 * Trang hướng dẫn
 * */
@Injectable({
  providedIn: 'root'
})
export class DriverService {
  constructor(@Inject(DOCUMENT) private doc: Document) {}

  load(): void {
    setTimeout(() => {
      const driver = new Driver({
        animate: false,
        allowClose: true,
        doneBtnText: 'Hoàn thành',
        closeBtnText: 'Đóng',
        nextBtnText: 'Bước tiếp theo',
        prevBtnText: ' Bước trước',
        onHighlightStarted: () => {
          this.doc.body.style.cssText = 'overflow:hidden';
        },
        onReset: () => {
          this.doc.body.style.cssText = '';
        }
      });
      driver.defineSteps([
        {
          element: '#menuNav',
          popover: {
            title: 'Menu',
            description: ' Đây là menu',
            position: 'right-center'
          }
        },
        {
          element: '#drawer-handle',
          popover: {
            title: 'Nút cài đặt chủ đề',
            description: 'Nhấp để mở cài đặt chủ đề, có thể kéo lên xuống',
            position: 'left'
          }
        },
        {
          element: '#tools',
          popover: {
            title: 'Thanh công cụ',
            description: 'Khóa màn hình, tìm kiếm menu, toàn màn hình, thông báo, đăng xuất, nhiều ngôn ngữ',
            position: 'bottom'
          }
        },
        {
          element: '#chats',
          popover: {
            title: ' Liên hệ quản trị viên',
            description: 'Liên hệ với quản trị viên',
            position: 'top'
          }
        },
        {
          element: '#trigger',
          popover: {
            title: 'Menu gập lại',
            description: 'Gập menu',
            position: 'bottom'
          }
        },
        {
          element: '#multi-tab',
          popover: {
            title: 'Tab đa nhiệm',
            description: 'Nhấp chuột phải vào một tab để mở nhiều tùy chọn, sau khi vượt quá màn hình, cuộn chuột để cuộn tab',
            position: 'bottom'
          }
        },
        {
          element: '#multi-tab2',
          popover: {
            title: 'Tab đa nhiệm',
            description: 'Nhấp chuột phải vào một tab để mở nhiều tùy chọn, sau khi vượt quá màn hình, cuộn chuột để cuộn tab',
            position: 'bottom'
          }
        }
      ]);
      driver.start();
    }, 500);
  }
}
