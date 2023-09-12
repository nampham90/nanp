import { NgIf, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { ActionCode } from '@app/config/actionCode';
import { DataScObj, DatascService } from '@app/core/services/http/system/datasc.service';
import { MenusService } from '@app/core/services/http/system/menus.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableComponent, AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@app/shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderComponent, PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { ModalBtnStatus } from '@app/widget/base-modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import * as Const from 'src/app/common/const';

import { MenuTreeComponent } from './menu-tree/menu-tree.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthDirective } from '@app/shared/directives/auth.directive';

interface SearchParam {
  title1: string;
  idmenu: string;
}

@Component({
  selector: 'app-datasc',
  templateUrl: './datasc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzButtonModule,
    NzWaveModule,
    NzSwitchModule,
    NzGridModule,
    MenuTreeComponent,
    PageHeaderComponent,
    AntTableComponent,
    CardTableWrapComponent,
    NgIf,
    NgFor,
    NzCardModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    AuthDirective,
  ]
})
export class DatascComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<any>;
  @ViewChild('availableFlag', { static: true }) availableFlag!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {};
  tableConfig!: AntTableConfig;
  dataList: DataScObj[] = [];
  checkedCashArray: DataScObj[] = [];
  ActionCode = ActionCode;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Quản lý dử liệu SC',
    breadcrumb: ['Home', 'Hệ thống', 'Quản lý dử liệu SC']
  };

  destroyRef = inject(DestroyRef);

  idmenu = '';
  menuName = '';

  dataSC!: DataScObj;

  constructor(private menuService: MenusService, public message: NzMessageService, private modalSrv: NzModalService, private cdr: ChangeDetectorRef, private dataService: DatascService) {}

  ngOnInit(): void {
    this.initTable();
  }

  searchMenutDatasc(idmenu: any): void {
    this.idmenu = idmenu;
    this.searchParam.idmenu = idmenu;
    this.getDataList();
    this.getNameMenu(this.idmenu);
  }

  edit(id: any): void {
    
  }

  del(id: any): void {
    
  }

  add(idmenu: string): void {
   
  }

  allDel(): void {}

  addEditData(param: DataScObj, methodName: 'editDatasc' | 'addDatasc'): void {
    console.log(param);
    this.dataService[methodName](param)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe(() => {
        this.getDataList();
      });
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableLoading(true);
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.dataService
      .getDataSc(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => {
        const { list, total, pageNum } = data;
        this.dataList = [...list];
        this.tableConfig.total = total!;
        this.tableConfig.pageIndex = pageNum!;
        this.tableLoading(false);
        this.checkedCashArray = [...this.checkedCashArray];
      });
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  reloadTable(): void {
    this.message.info('Làm mới thành công');
    this.getDataList();
  }

  selectedChecked(e: DataScObj[]): void {
    this.checkedCashArray = [...e];
  }
  changePageSize($event: any): void {}

  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  getNameMenu(id: string): void {
    this.menuService.getMenuDetail(id).subscribe(res => {
      this.menuName = res.menuName;
    });
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: true,
      headers: [
        {
          title: 'Tiêu đề 1',
          field: 'title1',
          width: 120
        },
        {
          title: 'Tiêu đề 1',
          field: 'title2',
          width: 120
        },
        {
          title: 'Ngôn ngữ',
          field: 'lang',
          width: 120
        },
        {
          title: 'Vị trí',
          field: 'vitri',
          width: 100
        },
        {
          title: 'Trạng thái',
          width: 150,
          field: 'status',
          tdTemplate: this.availableFlag
        },
        {
          title: 'Cập nhật',
          tdTemplate: this.operationTpl,
          width: 200,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
