import { NgIf } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SearchCommonVO } from '@core/services/types';
import { AntTableConfig, SortFile, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
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
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
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
    AntTableComponent,
    NzBadgeModule
  ]
})
export class SearchTableComponent implements OnInit {
  searchParam: Partial<SearchParam> = {};
  @ViewChild('highLightTpl', { static: true }) highLightTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  isCollapse = true;
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Biểu mẫu truy vấn (có thể kéo tiêu đề, nhấp vào nút "Xem" trong danh sách và trình bày thao tác mở chi tiết trong tab hiện tại, nếu bạn cần mở tab mới để hiển thị chi tiết, vui lòng chuyển đến "Chức năng > Tab Operation" để xem hiệu ứng trình diễn)',
    // desc: 'Các trang biểu mẫu được sử dụng để thu thập hoặc xác minh thông tin từ người dùng và các biểu mẫu cơ bản thường được sử dụng trong các tình huống biểu mẫu có ít mục dữ liệu hơn.',
    breadcrumb: ['Home', 'Danh sách', 'mẫu yêu cầu']
  };
  checkedCashArray: NzSafeAny[] = [
    {
      id: '1',
      noShow: 'Không được hiển thị theo mặc định',
      longText: 'văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài',
      newline: 'không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng',
      addStyle: 'thêm phong cách',
      name: 'mẫu tùy chỉnh',
      obj: { a: { b: 'Hãy chỉ ra giá trị 1' } }
    },
    {
      id: '2',
      noShow: 'Không được hiển thị theo mặc định',
      longText: 'văn bản siêu dài',
      newline: 'string',
      name: 'mẫu tùy chỉnh',
      addStyle: 'thêm phong cách',
      obj: { a: { b: 'Hãy chỉ ra giá trị 1' } }
    }
  ]; // Cần sửa lại kiểu dữ liệu tương ứng với doanh nghiệp
  dataList: NzSafeAny[] = []; // Cần sửa lại kiểu dữ liệu tương ứng với doanh nghiệp

  constructor(private fb: FormBuilder, private modalSrv: NzModalService, public message: NzMessageService, private router: Router, private cdr: ChangeDetectorRef) {}

  // Hộp kiểm ngoài cùng bên trái được chọn để kích hoạt
  selectedChecked(e: any): void {
    this.checkedCashArray = [...e];
  }

  // làm mới trang
  reloadTable(): void {
    this.message.info('đã được làm mới');
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
          id: '1',
          noShow: 'Không được hiển thị theo mặc định',
          longText: 'văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài văn bản siêu dài',
          newline: 'không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng không có dấu chấm lửng',
          addStyle: 'thêm phong cách',
          name: 'mẫu tùy chỉnh',
          obj: { a: { b: 'Giá trị được nhấp 1' } }
        },
        {
          id: '2',
          noShow: 'Không được hiển thị theo mặc định',
          longText: '文字超级长',
          newline: 'string',
          name: 'mẫu tùy chỉnh',
          addStyle: 'thêm phong cách',
          obj: { a: { b: 'Giá trị được nhấp 1' } }
        },
        {
          id: '3',
          noShow: 'Không được hiển thị theo mặc định',
          longText: 'string',
          newline: 'string',
          name: 'mẫu tùy chỉnh',
          addStyle: 'thêm phong cách',
          obj: { a: { b: 'Giá trị được nhấp 1' } }
        },
        {
          id: '4',
          noShow: 'Không được hiển thị theo mặc định',
          longText: 'string',
          newline: 'string',
          name: 'mẫu tùy chỉnh',
          addStyle: 'thêm phong cách',
          obj: { a: { b: 'Giá trị được nhấp 1' } }
        },
        {
          id: '5',
          noShow: 'Không được hiển thị theo mặc định',
          longText: 'string',
          newline: 'string',
          name: 'mẫu tùy chỉnh',
          addStyle: 'thêm phong cách',
          obj: { a: { b: 'Giá trị được nhấp 1' } }
        },
        {
          id: '6',
          noShow: 'Không được hiển thị theo mặc định',
          longText: 'string',
          newline: 'string',
          name: 'mẫu tùy chỉnh',
          addStyle: 'thêm phong cách',
          obj: { a: { b: 'Giá trị được nhấp 1' } }
        }
      ];
      this.tableConfig.total = 13;
      this.tableConfig.pageIndex = 1;
      this.checkedCashArray = [...this.checkedCashArray];
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

  /* cài lại */
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  /*Mở rộng*/
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  /*Kiểm tra*/
  check(name: string): void {
    // SkipLocationChange Đặt thành true khi điều hướng và không ghi trạng thái mới vào lịch sử
    this.router.navigate(['default/page-demo/list/search-table/search-table-detail', name, 123]);
  }

  add(): void {
    // this.modalService.show({nzTitle: 'Thêm mới'}).subscribe((res) => {
    //   if (!res || res.status === ModalBtnStatus.Cancel) {
    //     return;
    //   }
    //   this.tableLoading(true);
    //   this.addEditData(res.modalValue, 'addFireSys');
    // }, error => this.tableLoading(false));
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

  del(id: number): void {
    this.modalSrv.confirm({
      nzTitle: 'Bạn chắc chắn muốn xóa nó?',
      nzContent: 'Không thể khôi phục sau khi xóa',
      nzOnOk: () => {
        this.tableLoading(true);
        /*Chú thích là lệnh gọi giao diện mô phỏng*/
        // this.dataService.delFireSys([id]).subscribe(() => {
        //   if (this.dataList.length === 1) {
        //     this.tableConfig.pageIndex--;
        //   }
        //   this.getDataList();
        //   this.checkedCashArray.splice(this.checkedCashArray.findIndex(item => item.id === id), 1);
        // }, error => this.tableLoading(false));

        setTimeout(() => {
          this.message.info(`mảng id (hỗ trợ lưu phân trang):${JSON.stringify(id)}`);
          this.getDataList();
          this.checkedCashArray.splice(
            this.checkedCashArray.findIndex(item => item.id === id),
            1
          );
          this.tableLoading(false);
        }, 3000);
      }
    });
  }

  allDel(): void {
    if (this.checkedCashArray.length > 0) {
      this.modalSrv.confirm({
        nzTitle: 'Bạn chắc chắn muốn xóa nó?',
        nzContent: 'Không thể phục hồi sau khi xóa',
        nzOnOk: () => {
          const tempArrays: number[] = [];
          this.checkedCashArray.forEach(item => {
            tempArrays.push(item.id);
          });
          this.tableLoading(true);
          // Chú thích là lệnh gọi của giao diện giả
          // this.dataService.delFireSys(tempArrays).subscribe(() => {
          //   if (this.dataList.length === 1) {
          //     this.tableConfig.pageIndex--;
          //   }
          //   this.getDataList();
          //   this.checkedCashArray = [];
          // }, error => this.tableLoading(false));
          setTimeout(() => {
            this.message.info(`mảng id (hỗ trợ lưu phân trang):${JSON.stringify(tempArrays)}`);
            this.getDataList();
            this.checkedCashArray = [];
            this.tableLoading(false);
          }, 1000);
        }
      });
    } else {
      this.message.error('Vui lòng kiểm tra dữ liệu');
      return;
    }
  }

  changeSort(e: SortFile): void {
    this.message.info(`Trường sắp xếp:${e.fileName},Sắp xếp như:${e.sortDir}`);
  }

  // Sửa đổi một số mục trên một trang
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  private initTable(): void {
    /*
     * Lưu ý là bạn cần để lại một cột ở đây mà không đặt độ rộng để danh sách có thể điều chỉnh theo độ rộng
     *
     * */
    this.tableConfig = {
      headers: [
        {
          title: 'Không hiển thị theo mặc định',
          width: 130,
          field: 'noShow',
          show: false
        },
        {
          title: 'Văn bản rất dài',
          width: 130,
          field: 'longText',
          showSort: true
        },
        {
          title: 'dòng mới',
          width: 100,
          field: 'newline',
          notNeedEllipsis: true,
          showSort: true,
          tdClassList: ['text-wrap']
        },
        {
          title: 'Thêm phong cách',
          width: 100,
          field: 'addStyle',
          tdClassList: ['operate-text']
        },
        {
          title: 'mẫu tùy chỉnh',
          field: 'name',
          tdTemplate: this.highLightTpl,
          width: 140
        },
        {
          title: 'đối tượng chỉ ra（obj.a.b）',
          field: 'obj.a.b'
        },
        {
          title: 'vận hành',
          tdTemplate: this.operationTpl,
          width: 120,
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
