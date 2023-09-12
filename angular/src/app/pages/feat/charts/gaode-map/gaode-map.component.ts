import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import AMapLoader from '@amap/amap-jsapi-loader';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-gaode-map',
  templateUrl: './gaode-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, WaterMarkComponent, NzInputModule, FormsModule]
})
export class GaodeMapComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Bản đồ Gaode, đừng tiết lộ nơi ở của bạn.',
    breadcrumb: ['Home', 'Chức năng', 'đồ thị', 'Bản đồ Gaode']
  };
  marker: [number, number] = [116.437253, 39.935033];
  markerPosition: string = this.marker.join(',');

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    // ịa chỉ api
    // https://lbs.amap.com/demo/javascript-api/example/map-lifecycle/map-show
    // Hãy tự đăng ký lấy chìa khóa. Đừng sử dụng Chìa khóa của tôi. Cảm ơn bạn.
    // Địa chỉ ứng dụng https://console.amap.com/dev/key/app
    AMapLoader.load({
      key: '1c1b77fae2e59c25eb26ced9a0801103', //首次load必填
      version: '1.4.15',
      AMapUI: {
        version: '1.1',
        plugins: ['overlay/SimpleMarker']
      }
    })
      .then(AMap => {
        let map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 11,
          center: [116.397428, 39.90923]
        });

        const marker = new AMap.Marker({
          position: new AMap.LngLat(this.marker[0], this.marker[1]), // Đối tượng kinh độ và vĩ độ hoặc mảng một chiều của kinh độ và vĩ độ [116,39, 39,9]
          /*  title: '南京',*/
          draggable: true
        });
        marker.on('dragend', () => {
          this.marker = [marker.getPosition()['R'], marker.getPosition()['Q']];
          this.markerPosition = this.marker.join(',');
          this.cdr.markForCheck();
          console.log(this.markerPosition);
        });
        marker.setMap(map);
      })
      .catch(e => {
        console.error(e);
      });
  }

  ngOnInit(): void {}
}
