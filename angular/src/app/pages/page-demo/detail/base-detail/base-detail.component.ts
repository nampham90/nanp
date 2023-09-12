import { Component, OnInit, ChangeDetectionStrategy, TemplateRef, ViewChild } from '@angular/core';

import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';

interface ReturnObj {
  num: string;
  name: string;
  code: string;
  unitPrice: string;
  number: string;
  price: string;
}

@Component({
  selector: 'app-base-detail',
  templateUrl: './base-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, WaterMarkComponent, NzDescriptionsModule, NzDividerModule, AntTableComponent]
})
export class BaseDetailComponent implements OnInit {
  @ViewChild('returnProductTpl', { static: true }) returnProductTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Trang chi tiết cơ bản',
    breadcrumb: ['Home', 'Trang chi tiết', 'Trang chi tiết cơ bản']
  };
  returnTableConfig!: AntTableConfig;
  returnTableConfig2!: AntTableConfig;
  returnDataList: ReturnObj[] = [
    {
      num: '1234561',
      name: 'Nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'Nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'Nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'Nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    },
    {
      num: '1234561',
      name: 'Nước khoáng 550ml',
      code: '12421432143214321',
      unitPrice: '2.00',
      number: '1',
      price: '2.00'
    }
  ];

  constructor() {}

  private initReturnTable(): void {
    this.returnTableConfig = {
      showCheckbox: false,
      headers: [
        {
          title: 'Số sản phẩm',
          field: 'num',
          width: 150,
          tdTemplate: this.returnProductTpl
        },
        {
          title: 'tên sản phẩm',
          width: 160,
          field: 'name'
        },
        {
          title: 'mã vạch',
          width: 150,
          field: 'code'
        },
        {
          title: 'đơn giá',
          width: 150,
          field: 'unitPrice'
        },
        {
          title: 'Số lượng/cái',
          width: 150,
          field: 'number'
        },
        {
          title: 'số tiền',
          field: 'price'
        }
      ],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
    this.returnTableConfig2 = {
      showCheckbox: false,
      headers: [
        {
          title: 'Số sản phẩm',
          field: 'num',
          width: 150,
          tdTemplate: this.returnProductTpl
        },
        {
          title: 'tên sản phẩm',
          width: 160,
          field: 'name'
        },
        {
          title: 'mã vạch',
          width: 150,
          field: 'code'
        },
        {
          title: 'đơn giá',
          width: 150,
          field: 'unitPrice'
        },
        {
          title: 'Số lượng/cái)',
          width: 150,
          field: 'number'
        },
        {
          title: 'số tiền',
          field: 'price'
        }
      ],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnInit(): void {
    this.initReturnTable();
  }
}
