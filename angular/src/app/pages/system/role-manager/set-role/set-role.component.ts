import { NgFor, NgIf, NgTemplateOutlet, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap } from 'rxjs/operators';

import { UserInfoService } from '@app/core/services/store/common-store/userInfo.service';
import { Menu } from '@core/services/types';
import { MenusService } from '@services/system/menus.service';
import { PutPermissionParam, RoleService } from '@services/system/role.service';
import { FooterSubmitComponent } from '@shared/components/footer-submit/footer-submit.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { fnAddTreeDataGradeAndLeaf, fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList } from '@utils/treeTableTools';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-set-role',
  templateUrl: './set-role.component.html',
  styleUrls: ['./set-role.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    NgFor,
    NzCheckboxModule,
    FormsModule,
    NgIf,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzResultModule,
    NgTemplateOutlet,
    NgStyle,
    FooterSubmitComponent,
    NzWaveModule
  ]
})
export class SetRoleComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Thiết lập quyền',
    desc: 'Vai trò hiện tại：',
    breadcrumb: ['Home', 'Quản lý người dùng', 'Quản lý vai trò', 'Thiết lập quyền']
  };
  authCodeArr: string[] = [];
  permissionList: Array<Menu & { isOpen?: boolean; checked?: boolean }> = [];
  roleName!: string;
  userId!: string;
  destroyRef = inject(DestroyRef);
  @Input({ required: true }) id!: string; // Tính năng mới được hỗ trợ bởi ng16: Lấy ID vai trò từ định tuyến
  constructor(
    private dataService: RoleService,
    private cdr: ChangeDetectorRef,
    private menusService: MenusService,
    private routeInfo: ActivatedRoute,
    private router: Router,
    public message: NzMessageService,
    private userService: UserInfoService
  ) {}

  // 初始化数据
  initPermission(): void {
    // 通过角色id获取这个角色拥有的权限码
    this.dataService
      .getPermissionById(this.id)
      .pipe(
        concatMap(authCodeArr => {
          this.authCodeArr = authCodeArr;
          // 获取所有菜单
          return this.menusService.getMenuList({ pageNum: 0, pageSize: 0 });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(response => {
        // isOpen表示 节点是否展开
        const menuArray: Array<Menu & { isOpen?: boolean; checked?: boolean }> = response.list;
        menuArray.forEach(item => {
          item.isOpen = false;
          item.checked = this.authCodeArr.includes(item.code!);
        });
        this.permissionList = fnAddTreeDataGradeAndLeaf(fnFlatDataHasParentToTree(menuArray));
        this.cdr.markForCheck();
      });
  }

  getRoleName(): void {
    if (this.userId != '') {
      this.dataService
        .getRolesDetail(this.userId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(({ rolename }) => {
          this.pageHeaderInfo = { ...this.pageHeaderInfo, ...{ desc: `Vai trò hiện tại: ${rolename}` } };
          this.cdr.markForCheck();
        });
    }
  }

  back(): void {
    this.router.navigateByUrl(`/default/system/role-manager`);
  }

  submit(): void {
    const temp = [...this.permissionList];
    const flatArray = fnFlattenTreeDataByDataList(temp);
    const seledAuthArray: string[] = [];
    flatArray.forEach(item => {
      if (item['checked']) {
        seledAuthArray.push(`${item.id}`);
      }
    });
    const param: PutPermissionParam = {
      permissionIds: seledAuthArray,
      roleId: this.id
    };
    this.dataService
      .updatePermission(param)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.message.success('Cài đặt thành công, và nó sẽ có hiệu lực sau khi đăng nhập lại');
      });
  }

  _onReuseInit(): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(userInfo => {
      this.userId = userInfo.userId;
    });
    this.getRoleName();
    this.initPermission();
  }
}
