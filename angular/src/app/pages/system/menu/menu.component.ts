import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { OptionsInterface, SearchCommonVO } from '@core/services/types';
import { MenuListObj, MenusService } from '@services/system/menus.service';
import { AntTableConfig } from '@shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { TreeNodeInterface, TreeTableComponent } from '@shared/components/tree-table/tree-table.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { AuthDirective } from '@shared/directives/auth.directive';
import { MapKeyType, MapPipe, MapSet } from '@shared/pipes/map.pipe';
import { fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList } from '@utils/treeTableTools';
import { ModalBtnStatus } from '@widget/base-modal';
import { MenuModalService } from '@widget/biz-widget/system/menu-modal/menu-modal.service';
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
  menuName: number;
  visible: boolean;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    PageHeaderComponent,
    WaterMarkComponent,
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
    NgIf,
    NgTemplateOutlet,
    NzTagModule
  ]
})
export class MenuComponent implements OnInit {
  @ViewChild('zorroIconTpl', { static: true }) zorroIconTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('aliIconTpl', { static: true }) aliIconTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('visibleTpl', { static: true }) visibleTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('newLinkFlag', { static: true }) newLinkFlag!: TemplateRef<NzSafeAny>;

  ActionCode = ActionCode;
  searchParam: Partial<SearchParam> = {};
  destroyRef = inject(DestroyRef);
  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Quản lý menu',
    breadcrumb: ['Trang chủ', 'Quản lý hệ thống', 'Quản lý menu']
  };
  dataList: TreeNodeInterface[] = [];
  visibleOptions: OptionsInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private menuModalService: MenuModalService,
    private dataService: MenusService,
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
      .getMenuList(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(menuList => {
        const target = fnFlatDataHasParentToTree(menuList.list, 'fatherId');
        this.dataList = fnFlattenTreeDataByDataList(target);
        this.tableLoading(false);
      });
  }

  /*Làm mới form*/
  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(fatherId: number): void {
    this.menuModalService
      .show({ nzTitle: 'Thêm Mới' })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        res => {
          if (!res || res.status === ModalBtnStatus.Cancel) {
            return;
          }
          const param = { ...res.modalValue };
          param.fatherId = fatherId;
          this.tableLoading(true);
          this.addEditData(param, 'addMenus');
        },
        error => this.tableLoading(false)
      );
  }

  addEditData(param: MenuListObj, methodName: 'editMenus' | 'addMenus'): void {
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
    this.modalSrv.confirm({
      nzTitle: 'Bạn chắc chắn bạn muốn xóa nó？',
      nzContent: 'Không thể phục hồi sau khi xóa',
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService
          .delMenus(id)
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
      .getMenuDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.menuModalService
          .show({ nzTitle: 'Cập nhật' }, res)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(
            ({ modalValue, status }) => {
              if (status === ModalBtnStatus.Cancel) {
                return;
              }
              modalValue.id = id;
              modalValue.fatherId = fatherId;
              this.tableLoading(true);
              this.addEditData(modalValue, 'editMenus');
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
          title: 'Tên menu',
          width: 230,
          field: 'menuName'
        },
        {
          title: 'Icon zorro',
          field: 'icon',
          width: 100,
          tdTemplate: this.zorroIconTpl
        },
        {
          title: 'Icon Ali',
          field: 'alIcon',
          width: 100,
          tdTemplate: this.aliIconTpl
        },
        {
          title: 'Code',
          field: 'code',
          width: 300
        },
        {
          title: 'Định tuyến',
          field: 'path',
          width: 300
        },
        {
          title: 'Loại',
          field: 'orderNum',
          width: 80
        },
        {
          title: 'Trạng thái',
          field: 'status',
          pipe: 'available',
          width: 100
        },
        {
          title: 'Triển lãm',
          field: 'visible',
          pipe: 'isOrNot',
          tdTemplate: this.visibleTpl,
          width: 100
        },
        {
          title: 'Liên kết',
          field: 'newLinkFlag',
          pipe: 'isOrNot',
          tdTemplate: this.newLinkFlag,
          width: 100
        },
        {
          title: 'Thời gian',
          field: 'createTime',
          pipe: 'date:yyyy-MM-dd HH:mm',
          width: 180
        },
        {
          title: 'Vận Hành',
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
    this.visibleOptions = [...MapPipe.transformMapToArray(MapSet.visible, MapKeyType.Boolean)];
  }
}
