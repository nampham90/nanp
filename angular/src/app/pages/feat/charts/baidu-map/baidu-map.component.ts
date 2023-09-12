import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';

import { LazyService } from '@core/services/common/lazy.service';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzCardModule } from 'ng-zorro-antd/card';

declare var BMap: any;
@Component({
  selector: 'app-baidu-map',
  templateUrl: './baidu-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule]
})
export class BaiduMapComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Bản đồ Baidu, đừng tiết lộ nơi ở của bạn',
    breadcrumb: ['Home', 'Chức năng', 'đồ thị', 'Bản đồ Baidu']
  };

  constructor(private lazyService: LazyService) {}

  ngOnInit(): void {
    this.lazyService.loadScript('http://api.map.baidu.com/getscript?v=2.0&ak=RD5HkkjTa6uAIDpw7GRFtR83Fk7Wdk0j').then(() => {
      const map = new BMap.Map('map'); //Tạo một phiên bản bản đồ
      const point = new BMap.Point(116.404, 39.915); //Tạo tọa độ điểm
      map.centerAndZoom(point, 15); //Khởi tạo bản đồ và đặt tọa độ điểm trung tâm và cấp độ bản đồ
      map.enableScrollWheelZoom(true); //Bật thu phóng bánh xe chuột
    });
  }
}
