import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { ThemeService } from '@store/common-store/theme.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzGridModule, NgIf, WaterMarkComponent, NzCardModule, NzIconModule, NzButtonModule, NgFor, NzAvatarModule, AsyncPipe]
})
export class CardTableComponent implements OnInit, AfterViewInit {
  isOverMode$ = this.themesService.getIsOverMode();
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: ''
  };
  list = [
    {
      id: 1,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      name: 'Alipay',
      desc: 'Trong quá trình phát triển các sản phẩm trung cấp, các thông số kỹ thuật thiết kế và phương pháp triển khai khác nhau sẽ xuất hiện, nhưng thường có nhiều trang và thành phần tương tự nhau và những thành phần tương tự này sẽ được trích xuất thành một bộ thông số kỹ thuật tiêu chuẩn.'
    },
    {
      id: 2,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
      name: 'Angular',
      desc: 'Trong quá trình phát triển các sản phẩm trung cấp, các thông số kỹ thuật thiết kế và phương pháp triển khai khác nhau sẽ xuất hiện, nhưng thường có nhiều trang và thành phần tương tự nhau và những thành phần tương tự này sẽ được trích xuất thành một bộ thông số kỹ thuật tiêu chuẩn.'
    },
    {
      id: 3,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      name: 'Ant Design',
      desc: 'Trong quá trình phát triển các sản phẩm trung cấp, các thông số kỹ thuật thiết kế và phương pháp triển khai khác nhau sẽ xuất hiện, nhưng thường có nhiều trang và thành phần tương tự nhau và những thành phần tương tự này sẽ được trích xuất thành một bộ thông số kỹ thuật tiêu chuẩn.'
    },
    {
      id: 4,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
      name: 'Ant Design Pro',
      desc: 'Trong quá trình phát triển các sản phẩm trung cấp, các thông số kỹ thuật thiết kế và phương pháp triển khai khác nhau sẽ xuất hiện, nhưng thường có nhiều trang và thành phần tương tự nhau và những thành phần tương tự này sẽ được trích xuất thành một bộ thông số kỹ thuật tiêu chuẩn.'
    },
    {
      id: 5,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
      name: 'Bootstrap',
      desc: 'Trong quá trình phát triển các sản phẩm trung cấp, các thông số kỹ thuật thiết kế và phương pháp triển khai khác nhau sẽ xuất hiện, nhưng thường có nhiều trang và thành phần tương tự nhau và những thành phần tương tự này sẽ được trích xuất thành một bộ thông số kỹ thuật tiêu chuẩn.'
    },
    {
      id: 6,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
      name: 'React',
      desc: 'Trong quá trình phát triển các sản phẩm trung cấp, các thông số kỹ thuật thiết kế và phương pháp triển khai khác nhau sẽ xuất hiện, nhưng thường có nhiều trang và thành phần tương tự nhau và những thành phần tương tự này sẽ được trích xuất thành một bộ thông số kỹ thuật tiêu chuẩn.'
    },
    {
      id: 7,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
      name: 'Vue',
      desc: 'Trong quá trình phát triển các sản phẩm trung cấp, các thông số kỹ thuật thiết kế và phương pháp triển khai khác nhau sẽ xuất hiện, nhưng thường có nhiều trang và thành phần tương tự nhau và những thành phần tương tự này sẽ được trích xuất thành một bộ thông số kỹ thuật tiêu chuẩn.'
    },
    {
      id: 8,
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
      name: 'Webpack',
      desc: 'Trong quá trình phát triển các sản phẩm trung cấp, các thông số kỹ thuật thiết kế và phương pháp triển khai khác nhau sẽ xuất hiện, nhưng thường có nhiều trang và thành phần tương tự nhau và những thành phần tương tự này sẽ được trích xuất thành một bộ thông số kỹ thuật tiêu chuẩn.'
    }
  ];
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;

  constructor(private themesService: ThemeService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'danh sách thẻ',
      breadcrumb: ['trang đầu', 'Danh sách', 'danh sách thẻ'],
      desc: this.headerContent
    };
  }
}
