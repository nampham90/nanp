import { NgStyle, NgFor, NgIf, DecimalPipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { NumberLoopPipe } from '@shared/pipes/number-loop.pipe';
import { SearchListStoreService } from '@store/biz-store-service/search-list/search-list-store.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule,
    WaterMarkComponent,
    NzGridModule,
    NgStyle,
    NzTagModule,
    NgFor,
    NgIf,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzSelectModule,
    FormsModule,
    NzAvatarModule,
    NzTypographyModule,
    NzToolTipModule,
    NzDropDownModule,
    NzMenuModule,
    DecimalPipe,
    NumberLoopPipe
  ]
})
export class ApplicationComponent implements OnInit {
  expanded = false;
  searchInfo = {
    owner: ['2', '3'],
    author: null,
    like: null
  };
  allSelFlag = false;
  tagArray = [
    { name: 'loại một', isChecked: false },
    { name: 'Loại hai', isChecked: false },
    { name: 'Loại ba', isChecked: false },
    { name: 'Loại bốn', isChecked: false },
    { name: 'Loại năm', isChecked: false },
    { name: 'Loại sáu', isChecked: false },
    { name: 'Loại bảy', isChecked: false },
    { name: 'Loại tám', isChecked: false },
    { name: 'Loại chín', isChecked: false },
    { name: 'Loại mười', isChecked: false },
    { name: 'Loại mười một', isChecked: false },
    { name: 'Loại mười hai', isChecked: false }
  ];
  constructor(private searchListService: SearchListStoreService) {
    this._onReuseInit();
  }

  allSel(): void {
    this.allSelFlag = !this.allSelFlag;
    this.tagArray.forEach(item => {
      item.isChecked = this.allSelFlag;
    });
    this.tagArray = [...this.tagArray];
  }

  _onReuseInit(): void {
    this.searchListService.setCurrentSearchListComponentStore('Danh sách tìm kiếm (Dự án)');
  }

  ngOnInit(): void {}
}
