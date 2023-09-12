import { NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SearchCommonVO } from '@core/services/types';
import { AntTableConfig, SortFile } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TreeTableComponent } from '@shared/components/tree-table/tree-table.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { fnFlattenTreeDataByDataList } from '@utils/treeTableTools';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface SearchParam {
  ruleName: number;
  desc: string;
}

@Component({
  selector: 'app-tree-list',
  templateUrl: './tree-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    WaterMarkComponent,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NgIf,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    TreeTableComponent,
    NzBadgeModule
  ]
})
export class TreeListComponent implements OnInit {
  @ViewChild('highLightTpl', { static: true }) highLightTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {};

  isCollapse = true;
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Bảng cây (thể hiện giá trị mặc định, xóa hoặc xem, có thể in id của hàng đã chọn)',
    // desc: '',
    breadcrumb: ['Home', 'Danh sách', 'dạng cây']
  };
  checkedCashArray: any[] = [];
  dataList: NzSafeAny[] = [];

  constructor(private fb: FormBuilder, private modalSrv: NzModalService, public message: NzMessageService, private router: Router, private cdr: ChangeDetectorRef) {}

  reloadTable(): void {
    this.message.info('Đã được làm mới');
    this.getDataList();
  }

  // Phát hiện thay đổi bảng kích hoạt
  tableChangeDectction(): void {
    // Thay đổi tham chiếu sẽ kích hoạt phát hiện thay đổi.
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<NzSafeAny> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex! || this.tableConfig.pageIndex!
    };
    this.dataList = [];
    setTimeout(() => {
      this.dataList = [
        {
          id: `1`,
          name: 'John Brown sr.',
          sex: 'Nam',
          age: 60,
          address: 'New York No. 1 Lake Park',
          children: [
            {
              id: `1-1`,
              name: 'John Brown',
              age: 42,
              sex: 'Nam',
              address: 'New York No. 2 Lake Park'
            },
            {
              id: `1-2`,
              name: 'John Brown jr.',
              age: 30,
              sex: 'Nam',
              address: 'New York No. 3 Lake Park',
              children: [
                {
                  id: `1-2-1`,
                  name: 'Jimmy Brown',
                  sex: 'Nam',
                  age: 16,
                  address: 'New York No. 3 Lake Park'
                }
              ]
            },
            {
              id: `1-3`,
              name: 'Jim Green sr.',
              age: 72,
              sex: 'Nam',
              address: 'London No. 1 Lake Park',
              children: [
                {
                  id: `1-3-1`,
                  name: 'Jim Green',
                  sex: 'Nam',
                  age: 42,
                  address: 'London No. 2 Lake Park',
                  children: [
                    {
                      id: `1-3-1-1`,
                      name: 'Jim Green jr.',
                      sex: 'Nam',
                      age: 25,
                      address: 'London No. 3 Lake Park'
                    },
                    {
                      id: `1-3-1-2`,
                      name: 'Jimmy Green sr.',
                      sex: 'Nam',
                      age: 18,
                      address: 'London No. 4 Lake Park'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: `2`,
          name: 'Joe Black',
          sex: 'Nam',
          age: 32,
          address: 'Sidney No. 1 Lake Park'
        }
      ];
      this.tableConfig.total = 13;
      this.tableConfig.pageIndex = 1;
      const cashFromHttp = [
        {
          id: `1`,
          name: 'John Brown sr.',
          sex: 'Nam',
          age: 60,
          address: 'New York No. 1 Lake Park',
          children: [
            {
              id: `1-2`,
              name: 'John Brown jr.',
              age: 30,
              sex: 'Nam',
              address: 'New York No. 3 Lake Park',
              children: [
                {
                  id: `1-2-1`,
                  name: 'Jimmy Brown',
                  sex: 'Nam',
                  age: 16,
                  address: 'New York No. 3 Lake Park'
                }
              ]
            },
            {
              id: `1-3`,
              name: 'Jim Green sr.',
              age: 72,
              sex: 'Nam',
              address: 'London No. 1 Lake Park',
              children: [
                {
                  id: `1-3-1`,
                  name: 'Jim Green',
                  sex: 'Nam',
                  age: 42,
                  address: 'London No. 2 Lake Park',
                  children: [
                    {
                      id: `1-3-1-1`,
                      name: 'Jim Green jr.',
                      sex: 'Nam',
                      age: 25,
                      address: 'London No. 3 Lake Park'
                    },
                    {
                      id: `1-3-1-2`,
                      name: 'Jimmy Green sr.',
                      sex: 'Nam',
                      age: 18,
                      address: 'London No. 4 Lake Park'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
      this.checkedCashArray = fnFlattenTreeDataByDataList(cashFromHttp);
      // this.checkedCashArray = [...this.checkedCashArray];
      this.tableLoading(false);
    });

    /*-----Giao diện http yêu cầu kinh doanh thực tế như sau------*/
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<any> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.dataService.getFireSysList(params).pipe(finalize(() => {
    //   this.tableLoading(false);
    // })).subscribe((data => {
    //   const {list, total, pageNum} = data;
    //   this.dataList = [...list];
    //   this.tableConfig.total = total!;
    //   this.tableConfig.pageIndex = pageNum!;
    //   this.tableLoading(false);
    //   this.checkedCashArray = [...this.checkedCashArray];
    // }));
  }

  /*Mở rộng*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  /*Kiểm tra*/
  check(id: string, children: any[], parent: any[]): void {
    this.message.success(id);
    console.log(children);
    console.log(parent);
  }

  /*cài lại*/
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(): void {
    // this.modalService.show({nzTitle: '新增'}).subscribe((res) => {
    //   if (!res || res.status === ModalBtnStatus.Cancel) {
    //     return;
    //   }
    //   this.tableLoading(true);
    //   this.addEditData(res.modalValue, 'addFireSys');
    // }, error => this.tableLoading(false));
  }

  del(id: number): void {
    this.modalSrv.confirm({
      nzTitle: 'Bạn chắc chắn muốn xóa nó?',
      nzContent: 'Không thể phục hồi sau khi xóa',
      nzOnOk: () => {
        this.tableLoading(true);
        this.message.info(`mảng id (hỗ trợ lưu phân trang):${JSON.stringify(id)}`);
        this.getDataList();
        this.checkedCashArray.splice(
          this.checkedCashArray.findIndex(item => item.id === id),
          1
        );
        this.tableLoading(false);
        /*Chú thích là lệnh gọi giao diện mô phỏng*/
        // this.dataService.delFireSys([id]).subscribe(() => {
        //   if (this.dataList.length === 1) {
        //     this.tableConfig.pageIndex--;
        //   }
        //   this.getDataList();
        //   this.checkedCashArray.splice(this.checkedCashArray.findIndex(item => item.id === id), 1);
        // }, error => this.tableLoading(false));
      }
    });
  }

  allDel(): void {
    if (this.checkedCashArray.length > 0) {
      this.modalSrv.confirm({
        nzTitle: 'Bạn có chắc muốn xóa không?',
        nzContent: 'Không thể phục hồi sau khi xóa',
        nzOnOk: () => {
          const tempArrays: number[] = [];
          this.checkedCashArray.forEach(item => {
            tempArrays.push(item.id);
          });
          this.tableLoading(true);
          this.message.info(`Mảng (hỗ trợ lưu phân trang):${JSON.stringify(tempArrays)}`);
          this.getDataList();
          this.checkedCashArray = [];
          this.tableLoading(false);
          // Chú thích là lệnh gọi của giao diện giả
          // this.dataService.delFireSys(tempArrays).subscribe(() => {
          //   if (this.dataList.length === 1) {
          //     this.tableConfig.pageIndex--;
          //   }
          //   this.getDataList();
          //   this.checkedCashArray = [];
          // }, error => this.tableLoading(false));
        }
      });
    } else {
      this.message.error('Vui lòng kiểm tra dữ liệu');
      return;
    }
  }

  // Cập nhật
  edit(id: number): void {
    // this.dataService.getFireSysDetail(id).subscribe(res => {
    //   this.modalService.show({nzTitle: 'Cập nhật'}, res).subscribe(({modalValue, status}) => {
    //     if (status === ModalBtnStatus.Cancel) {
    //       return;
    //     }
    //     modalValue.id = id;
    //     this.tableLoading(true);
    //     this.addEditData(modalValue, 'editFireSys');
    //   }, error => this.tableLoading(false));
    // });
  }

  // addEditData(param: FireSysObj, methodName: 'editFireSys' | 'addFireSys'): void {
  //   this.dataService[methodName](param).subscribe(() => {
  //     this.getDataList();
  //   });
  // }

  changeSort(e: SortFile): void {
    this.message.info(`Trường sắp xếp:：${e.fileName},Sắp xếp như:${e.sortDir}`);
  }

  //Hộp kiểm ngoài cùng bên trái được chọn để kích hoạt
  selectedChecked(e: any): void {
    this.checkedCashArray = [...e];
    console.log(this.checkedCashArray);
  }

  // Sửa đổi một số mục trên một trang
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  private initTable(): void {
    /*
     * Lưu ý là bạn cần để lại một cột ở đây mà không đặt độ rộng để danh sách có thể điều chỉnh theo độ rộng
     * */
    this.tableConfig = {
      headers: [
        {
          title: 'Tên',
          width: 230,
          field: 'name',
          showSort: true,
          tdClassList: ['operate-text']
        },
        {
          title: 'giới tính',
          field: 'sex',
          width: 230,
          tdTemplate: this.highLightTpl
        },
        {
          title: 'tuổi',
          field: 'age',
          width: 230,
          showSort: true
        },
        {
          title: 'Địa chỉ',
          field: 'address'
        },
        {
          title: 'vận hành',
          tdTemplate: this.operationTpl,
          width: 130,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      showCheckbox: true,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnInit(): void {
    this.initTable();
  }
}
