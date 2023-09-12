import { NgFor, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { OptionsInterface, SearchCommonVO } from '@core/services/types';
import { Dept, DeptService } from '@services/system/dept.service';
import { AntTableConfig } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TreeNodeInterface, TreeTableComponent } from '@shared/components/tree-table/tree-table.component';
import { AuthDirective } from '@shared/directives/auth.directive';
import { MapKeyType, MapPipe, MapSet } from '@shared/pipes/map.pipe';
import { fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList } from '@utils/treeTableTools';
import { ModalBtnStatus } from '@widget/base-modal';
import { DeptManageModalService } from '@widget/biz-widget/system/dept-manage-modal/dept-manage-modal.service';
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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

interface SearchParam {
  departmentName: string;
  state: boolean;
}

@Component({
  selector: 'app-dept',
  templateUrl: './dept.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    NgFor,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    TreeTableComponent,
    AuthDirective,
    NgTemplateOutlet,
    NzTagModule
  ]
})
export class DeptComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('state', { static: true }) state!: TemplateRef<NzSafeAny>;
  ActionCode = ActionCode;
  searchParam: Partial<SearchParam> = {};
  destroyRef = inject(DestroyRef);
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Quản lý bộ phận',
    breadcrumb: ['Home', 'Quản ly hệ thống', 'Quản lý bộ phận']
  };
  dataList: TreeNodeInterface[] = [];
  stateOptions: OptionsInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private deptModalService: DeptManageModalService,
    private dataService: DeptService,
    private modalSrv: NzModalService,
    public message: NzMessageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  reloadTable(): void {
    this.message.info('Đã được làm mới');
    this.getDataList();
  }

  // 触发表格变更检测
  tableChangeDectction(): void {
    // 改变引用触发变更检测。
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: 0,
      pageNum: 0,
      filters: this.searchParam
    };
    this.dataService
      .getDepts(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(deptList => {
        const target = fnFlatDataHasParentToTree(deptList.list);
        this.dataList = fnFlattenTreeDataByDataList(target);
        this.tableLoading(false);
      });
  }

  /*查看*/
  check(id: string, children: any[], parent: any[]): void {
    this.message.success(id);
  }

  /*重置*/
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(fatherId: number): void {
    this.deptModalService
      .show({ nzTitle: '新增' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        res => {
          if (!res || res.status === ModalBtnStatus.Cancel) {
            return;
          }
          const param = { ...res.modalValue };
          param.fatherId = fatherId;
          this.tableLoading(true);
          this.addEditData(param, 'addDepts');
        },
        error => this.tableLoading(false)
      );
  }

  addEditData(param: Dept, methodName: 'editDepts' | 'addDepts'): void {
    this.dataService[methodName](param)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.getDataList();
      });
  }

  del(id: number): void {
    const ids: number[] = [id];
    this.modalSrv.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa không？',
      nzContent: 'Không thể khôi phúc khi xóa',
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService
          .delDepts(ids)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(
            () => {
              if (this.dataList.length === 1) {
                this.tableConfig.pageIndex--;
              }
              this.getDataList();
            },
            error => this.tableLoading(false)
          );
      }
    });
  }

  // 修改
  edit(id: number, fatherId: number): void {
    this.dataService
      .getDeptsDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.deptModalService
          .show({ nzTitle: '编辑' }, res)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(
            ({ modalValue, status }) => {
              if (status === ModalBtnStatus.Cancel) {
                return;
              }
              modalValue.id = id;
              modalValue.fatherId = fatherId;
              this.tableLoading(true);
              this.addEditData(modalValue, 'editDepts');
            },
            error => this.tableLoading(false)
          );
      });
  }

  // 修改一页几条
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Tên bộ phận',
          width: 180,
          field: 'tenphongban'
        },
        {
          title: 'Trạng thái',
          field: 'state',
          tdTemplate: this.state,
          width: 100
        },
        {
          title: 'Loại',
          field: 'orderNum',
          width: 100
        },
        {
          title: 'Ngày tạo',
          field: 'createdAt',
          pipe: 'date:yyyy-MM-dd HH:mm',
          width: 180
        },
        {
          title: 'Vận hành',
          tdTemplate: this.operationTpl,
          width: 250,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnInit(): void {
    this.initTable();
    this.stateOptions = [...MapPipe.transformMapToArray(MapSet.available, MapKeyType.Boolean)];
  }
}
