import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { MessageService } from '@core/services/common/message.service';
import { SearchCommonVO } from '@core/services/types';
import { Role, RoleService } from '@services/system/role.service';
import { AntTableConfig, AntTableComponent } from '@shared/components/ant-table/ant-table.component';
import { InputNumberComponent } from '@shared/components/input-number/input-number.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { AuthDirective } from '@shared/directives/auth.directive';
import { ModalBtnStatus } from '@widget/base-modal';
import { RoleManageModalService } from '@widget/biz-widget/system/role-manage-modal/role-manage-modal.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { CurrencyPipe, DecimalPipe, NgIf } from '@angular/common';
import { InputCurrencyComponent } from '@app/shared/components/input-currency/input-currency.component';

interface SearchParam {
  rolename: string;
}

@Component({
  selector: 'app-role-manage',
  templateUrl: './role-manage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    AntTableComponent,
    AuthDirective,
    InputNumberComponent,
    InputCurrencyComponent,
    NgIf
  ],
  providers: [DecimalPipe,CurrencyPipe]
})
export class RoleManageComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<any>;
  searchParam: Partial<SearchParam> = {};
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Quản lý vai trò',
    breadcrumb: ['Home', 'Quản lý người dùng', 'Quản lý vai trò']
  };
  dataList: Role[] = [];
  checkedCashArray = [];
  ActionCode = ActionCode;
  destroyRef = inject(DestroyRef);

  flg = true;
  numberMode = 1000;
  amountMode = 1000;

  constructor(
    private dataService: RoleService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private modalService: RoleManageModalService,
    private router: Router,
    public message: NzMessageService
  ) {}

  changeNumber($event: any) {this.numberMode = $event; }
  changeAmount($event: any) {this.amountMode = $event; }

  selectedChecked(e: any): void {
    // @ts-ignore
    this.checkedCashArray = [...e];
  }

  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.dataService
      .getRoles(params)
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

  // 设置权限
  setRole(id: number): void {
    this.router.navigate(['/default/system/role-manager/set-role'], { queryParams: { id: id } });
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

  add(): void {
    this.modalService
      .show({ nzTitle: 'Thêm mới' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        res => {
          if (!res || res.status === ModalBtnStatus.Cancel) {
            return;
          }
          const param = { ...res.modalValue };
          this.tableLoading(true);
          this.addEditData(param, 'addRoles');
        },
        error => this.tableLoading(false)
      );
  }

  reloadTable(): void {
    this.message.info('Làm mới thành công');
    this.getDataList();
  }

  // 修改
  edit(id: number): void {
    this.dataService
      .getRolesDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.modalService
          .show({ nzTitle: 'Cập nhật' }, res)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(
            ({ modalValue, status }) => {
              if (status === ModalBtnStatus.Cancel) {
                return;
              }
              modalValue.id = id;
              this.tableLoading(true);
              this.addEditData(modalValue, 'editRoles');
            },
            error => this.tableLoading(false)
          );
      });
  }

  addEditData(param: Role, methodName: 'editRoles' | 'addRoles'): void {
    this.dataService[methodName](param)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getDataList();
      });
  }

  del(id: number): void {
    const ids: number[] = [id];
    this.modalSrv.confirm({
      nzTitle: 'Bạn chắc chắn muốn xóa không？',
      nzContent: 'Không khôi phục được khi dữ liệu bị xóa !',
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService
          .delRoles(ids)
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
  // 修改一页几条

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  ngOnInit(): void {
    this.initTable();
  }

  private initTable(): void {
    this.tableConfig = {
      showCheckbox: false,
      headers: [
        {
          title: 'Tên vai trò',
          field: 'rolename',
          width: 100
        },
        {
          title: 'Mô tả',
          width: 400,
          field: 'mota'
        },
        {
          title: 'Vận hành',
          tdTemplate: this.operationTpl,
          width: 280,
          fixed: true,
          fixedDir: 'right'
        }
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
