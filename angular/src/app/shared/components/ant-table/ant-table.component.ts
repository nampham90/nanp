import { NgIf, NgFor, NgClass, NgTemplateOutlet } from '@angular/common';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzResizeEvent, NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzTableQueryParams, NzTableSize, NzTableModule } from 'ng-zorro-antd/table';

import { MapPipe } from '../../pipes/map.pipe';
import { TableFiledPipe } from '../../pipes/table-filed.pipe';
export interface TableHeader {
  title: string; // tên tiêu đề
  field?: string; // tên trường
  pipe?: string; // định dạng
  showSort?: boolean; // Có hiển thị sắp xếp hay không
  sortDir?: undefined | 'asc' | 'desc'; // chiều sắp xếp
  width?: number; // chiều rộng ô
  thTemplate?: TemplateRef<NzSafeAny>; // mẫu ô th
  tdTemplate?: TemplateRef<NzSafeAny>; //mẫu tế bào td
  fixed?: boolean; // Có sửa ô hay không (chỉ hợp lệ nếu sửa liên tục từ ngoài cùng bên trái hoặc ngoài cùng bên phải)
  fixedDir?: 'left' | 'right'; // Cho dù nó được cố định ở bên trái hay bên phải, nó cần được sử dụng với cố định.
  notNeedEllipsis?: boolean; // Đưa ra sự thật khi không cần thiết
  tdClassList?: string[]; // Chỉ định một lớp cho ô td (lớp trong thành phần cha mẹ phải có tiền tố /deep/ để có hiệu lực đối với thành phần con)
  thClassList?: string[]; // Chỉ định lớp cho ô thứ (lớp trong thành phần cha phải có tiền tố /deep/ để có hiệu lực cho th
  show?: boolean; //Có hiển thị cột hay không, sai: không hiển thị, khác: hiển thị
  tdClassFn?: (data: any, index: number) => string[];
  thClassFn?: (data: any) => string[];
}

export interface AntTableConfig {
  needNoScroll?: boolean; //Danh sách có yêu cầu thanh cuộn không?
  xScroll?: number; //Danh sách thanh cuộn ngang
  yScroll?: number; //liệt kê thanh cuộn dọc
  virtualItemSize?: number; //Chiều cao của mỗi cột trong khi cuộn ảo, giống như cdk itemSize
  showCheckbox?: boolean; // Nếu cần checkBox, bạn cần showCheckbox=true và khi sử dụng thành phần bảng kiến ​​ứng dụng, hãy chuyển vào [checkedCashArrayFromComment]="cashArray". cashArray là một mảng do chính bạn xác định trong thành phần nghiệp vụ và dữ liệu trong bảng cần phải có thuộc tính id.
  pageIndex: number; // Số trang hiện tại, (liên kết hai chiều với số trang trong trang)
  pageSize: number; //Số lượng mục dữ liệu hiển thị trên mỗi trang (liên kết hai chiều với pageSize trong trang)
  total: number; //Tổng lượng dữ liệu được sử dụng để tính toán phân trang (nên lấy từ giao diện phụ trợ)
  loading: boolean; // Có hiển thị bảng tải hay không
  headers: TableHeader[]; // cài đặt cột
}

export abstract class AntTableComponentToken {
  tableSize!: NzTableSize;
  tableConfig!: AntTableConfig;

  abstract tableChangeDectction(): void;
}

export interface SortFile {
  fileName: string;
  sortDir: undefined | 'desc' | 'asc';
}

@Component({
  selector: 'app-ant-table',
  templateUrl: './ant-table.component.html',
  styleUrls: ['./ant-table.component.less'],
  providers: [{ provide: AntTableComponentToken, useExisting: AntTableComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzTableModule, NgIf, NgFor, NzResizableModule, NgClass, NgTemplateOutlet, MapPipe, TableFiledPipe]
})
export class AntTableComponent implements OnInit, OnChanges {
  _dataList!: NzSafeAny[];
  _tableConfig!: AntTableConfig;
  _scrollConfig: { x: string; y: string } | {} = {};
  // Mảng dữ liệu hộp kiểm đã được lưu trong bộ nhớ đệm được truyền vào từ thành phần nghiệp vụ
  @Input() checkedCashArrayFromComment: NzSafeAny[] = [];

  @Input()
  set tableData(value: NzSafeAny[]) {
    this._dataList = value;
    if (this.tableConfig.showCheckbox) {
      this._dataList.forEach(item => {
        item['_checked'] = false;
      });
    }
  }

  get tableData(): NzSafeAny[] {
    return this._dataList;
  }

  _tableSize: NzTableSize = 'small';
  set tableSize(value: NzTableSize) {
    this._tableSize = value;
    this.tableChangeDectction();
  }

  get tableSize(): NzTableSize {
    return this._tableSize;
  }

  @Input()
  set tableConfig(value: AntTableConfig) {
    this._tableConfig = value;
    this.setScrollConfig(value);
  }

  get tableConfig(): AntTableConfig {
    return this._tableConfig;
  }

  @Output() readonly changePageNum = new EventEmitter<NzTableQueryParams>();
  @Output() readonly changePageSize = new EventEmitter<number>();
  @Output() readonly selectedChange: EventEmitter<NzSafeAny[]> = new EventEmitter<NzSafeAny[]>();
  @Output() readonly sortFn: EventEmitter<SortFile> = new EventEmitter<SortFile>();
  indeterminate: boolean = false;
  allChecked: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  setScrollConfig(value: AntTableConfig): void {
    if (value && !value.needNoScroll) {
      // Mặc định x: 100
      this._scrollConfig = { x: '100px' };
      let tempX = {};
      if (value.xScroll !== undefined) {
        tempX = { x: `${value.xScroll}px` };
      }
      let tempY = {};
      if (value.yScroll !== undefined) {
        tempY = { y: `${value.yScroll}px` };
      }
      this._scrollConfig = { ...this._scrollConfig, ...tempX, ...tempY };
    } else {
      this._scrollConfig = {};
    }
  }

  changeSort(tableHeader: TableHeader): void {
    this.tableConfig.headers.forEach(item => {
      if (item.field !== tableHeader.field) {
        item.sortDir = undefined;
      }
    });
    const sortDicArray: [undefined, 'asc', 'desc'] = [undefined, 'asc', 'desc'];
    const index = sortDicArray.findIndex(item => item === tableHeader.sortDir);
    tableHeader.sortDir = index === sortDicArray.length - 1 ? sortDicArray[0] : sortDicArray[index + 1];
    this.sortFn.emit({ fileName: tableHeader.field!, sortDir: tableHeader.sortDir });
  }

  tableChangeDectction(): void {
    //Thay đổi tham chiếu sẽ kích hoạt phát hiện thay đổi.
    this._dataList = [...this._dataList];
    this.cdr.markForCheck();
  }

  trackById(_: number, data: { id: number }): number {
    return data.id;
  }

  public trackByTableHead(index: number, item: NzSafeAny): NzSafeAny {
    return item;
  }

  public trackByTableBody(index: number, item: NzSafeAny): NzSafeAny {
    return item;
  }

  // Thay đổi số trang phân trang
  onQueryParamsChange(tableQueryParams: NzTableQueryParams): void {
    this.changePageNum.emit(tableQueryParams);
  }

  //Sửa đổi số trang của một số mục trên một trang
  onPageSizeChange($event: NzSafeAny): void {
    this.changePageSize.emit($event);
  }

  onResize({ width }: NzResizeEvent, col: string): void {
    this.tableConfig.headers = this.tableConfig.headers.map(e =>
      e.title === col
        ? {
            ...e,
            width: +`${width}`
          }
        : e
    ) as TableHeader[];
  }

  checkFn(dataItem: NzSafeAny, isChecked: boolean): void {
    dataItem['_checked'] = isChecked;
    const index = this.checkedCashArrayFromComment.findIndex(cashItem => cashItem.id === dataItem.id);
    if (isChecked) {
      if (index === -1) {
        this.checkedCashArrayFromComment.push(dataItem);
      }
    } else {
      if (index !== -1) {
        this.checkedCashArrayFromComment.splice(index, 1);
      }
    }
  }

  // Lựa chọn duy nhất
  public checkRowSingle(isChecked: boolean, selectIndex: number): void {
    this.checkFn(this._dataList[selectIndex], isChecked);
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // chọn tất cả
  onAllChecked(isChecked: boolean): void {
    this._dataList.forEach(item => {
      this.checkFn(item, isChecked);
    });
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // Làm mới trạng thái hộp kiểm
  refreshStatus(): void {
    this._dataList.forEach(item => {
      const index = this.checkedCashArrayFromComment.findIndex(cashItem => {
        return item.id === cashItem.id;
      });
      item['_checked'] = index !== -1;
    });
    const allChecked =
      this._dataList.length > 0 &&
      this._dataList.every(item => {
        return item['_checked'] === true;
      });
    const allUnChecked = this._dataList.every(item => item['_checked'] !== true);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkedCashArrayFromComment']) {
      this.refreshStatus();
    }
  }
}
