import { NgIf, NgFor, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';

import { AntTableConfig, SortFile, TableHeader } from '@shared/components/ant-table/ant-table.component';
import { fnGetFlattenTreeDataByMap, fnTreeDataToMap } from '@utils/treeTableTools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzResizeEvent, NzResizableModule } from 'ng-zorro-antd/resizable';
import { NzTableQueryParams, NzTableSize, NzTableModule } from 'ng-zorro-antd/table';

import { MapPipe } from '../../pipes/map.pipe';
import { TableFiledPipe } from '../../pipes/table-filed.pipe';

export interface TreeNodeInterface {
  id: string | number;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;

  [key: string]: any;
}

export abstract class AntTreeTableComponentToken {
  tableSize!: NzTableSize;
  tableConfig!: AntTableConfig;

  abstract tableChangeDectction(): void;
}

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.less'],
  providers: [{ provide: AntTreeTableComponentToken, useExisting: TreeTableComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NzTableModule, NgIf, NgFor, NzResizableModule, NgClass, NgTemplateOutlet, MapPipe, TableFiledPipe]
})
export class TreeTableComponent implements OnInit, OnChanges {
  _dataList!: TreeNodeInterface[];
  allChecked: boolean = false;
  indeterminate = false;
  //Mảng dữ liệu hộp kiểm đã chọn được lưu trong bộ nhớ đệm được truyền vào từ thành phần nghiệp vụ tương đương với dữ liệu bảng được lưu trong bộ nhớ đệm
  @Input() cashArray: NzSafeAny[] = [];
  checkedCashArrayFromComment: NzSafeAny[] = [];
  @Output() readonly sortFn: EventEmitter<SortFile> = new EventEmitter<SortFile>();
  @Output() readonly changePageNum = new EventEmitter<NzTableQueryParams>();
  @Output() readonly changePageSize = new EventEmitter<number>();
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  @Input() tableConfig!: AntTableConfig;
  @Output() readonly selectedChange: EventEmitter<NzSafeAny[]> = new EventEmitter<NzSafeAny[]>();
  cashExpandIdArray: Array<number | string> = []; // Lưu trữ id của nút mở rộng

  @Input()
  set tableData(value: TreeNodeInterface[]) {
    this._dataList = value;
    // Lấy treeData dưới dạng bản đồ theo dataList, mỗi key tương ứng với một nhóm (tức là một tập con) dữ liệu
    this.mapOfExpandedData = fnTreeDataToMap(this._dataList);
    const beFilterId: Array<string | number> = []; // Mảng id của tập con của dữ liệu mở rộng cần xóa
    Object.values(this.mapOfExpandedData).forEach(menuArray => {
      menuArray.forEach(menuItem => {
        if (this.cashExpandIdArray.includes(menuItem.id)) {
          menuItem.expand = true;
          // Hãy để tập hợp con nút hiện tại được lưu vào bộ nhớ đệm, sau đó xóa nó sau, nếu không dữ liệu của tập hợp con sẽ dư thừa đến mức mà việc mở rộng là đúng
          if (menuItem.children && menuItem.children.length > 0) {
            menuItem.children.forEach(item => {
              beFilterId.push(item.id);
            });
          }
        }
      });
    });
    beFilterId.forEach(item => {
      delete this.mapOfExpandedData[item];
    });
  }

  get tableData(): NzSafeAny[] {
    return this._dataList;
  }

  _tableSize: NzTableSize = 'default';
  set tableSize(value: NzTableSize) {
    this._tableSize = value;
    this.tableChangeDectction();
  }

  get tableSize(): NzTableSize {
    return this._tableSize;
  }

  constructor(private cdr: ChangeDetectorRef) {}

  tableChangeDectction(): void {
    //Thay đổi tham chiếu sẽ kích hoạt phát hiện thay đổi.
    this._dataList = [...this._dataList];
    this.cdr.markForCheck();
  }

  // kéo tiêu đề
  onResize(nzResizeEvent: NzResizeEvent, col: string): void {
    this.tableConfig.headers = this.tableConfig.headers.map(e =>
      e.title === col
        ? {
            ...e,
            width: +`${nzResizeEvent.width}`
          }
        : e
    ) as TableHeader[];
  }

  // Bấm để sắp xếp
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

  // Thay đổi số trang phân trang
  onQueryParamsChange(tableQueryParams: NzTableQueryParams): void {
    this.changePageNum.emit(tableQueryParams);
  }

  //Sửa đổi số trang của một số mục trên một trang
  onPageSizeChange($event: NzSafeAny): void {
    this.changePageSize.emit($event);
  }

  changecashExpandIdArray(id: number | string, expand: boolean): void {
    const index = this.cashExpandIdArray.indexOf(id);
    if (expand) {
      if (index === -1) {
        this.cashExpandIdArray.push(id);
      }
    } else {
      if (index !== -1) {
        this.cashExpandIdArray.splice(index, 1);
      }
    }
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    this.changecashExpandIdArray(data.id, $event);
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  // Đặt đã kiểm tra hay không và xử lý các giá trị được lưu trong bộ nhớ cache
  setIsCheckFn(dataItem: NzSafeAny, isChecked: boolean): void {
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

  // chọn tất cả
  onAllChecked(isChecked: boolean): void {
    fnGetFlattenTreeDataByMap(this.mapOfExpandedData).forEach(row => {
      this.setIsCheckFn(row, isChecked);
    });
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // Lựa chọn duy nhất
  public checkRowSingle(isChecked: boolean, selectIndex: number, row: TreeNodeInterface): void {
    this.setIsCheckFn(row, isChecked);
    this.selectedChange.emit(this.checkedCashArrayFromComment);
    this.refreshStatus();
  }

  // Làm mới trạng thái hộp kiểm
  refreshStatus(): void {
    // Lấy dữ liệu cây phẳng
    const dataTempArray: TreeNodeInterface[] = fnGetFlattenTreeDataByMap(this.mapOfExpandedData);

    const allChecked =
      dataTempArray.length > 0 &&
      dataTempArray.every(item => {
        return item['_checked'] === true;
      });
    const allUnChecked = dataTempArray.length > 0 && dataTempArray.every(item => item['_checked'] !== true);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnChecked;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cashArray'] && !changes['cashArray'].firstChange) {
      this.checkedCashArrayFromComment = [...changes['cashArray'].currentValue];
      fnGetFlattenTreeDataByMap(this.mapOfExpandedData).forEach(row => {
        // Xác định xem giá trị có tồn tại trong bộ đệm hay không và nếu có, hãy đặt nó thành true
        const index = this.checkedCashArrayFromComment.findIndex(item => item.id === row.id);
        this.setIsCheckFn(row, index !== -1);
      });
      this.refreshStatus();
    }
  }

  ngOnInit(): void {}
}
