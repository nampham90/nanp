/*Cấu hình mã quyền*/
export const ActionCode = {
  /*Thao tác tab mở chi tiết*/
  TabsDetail: 'default:feat:tabs:example-detail',
  /*Mẫu yêu cầu Mở Xem*/
  SearchTableDetail: 'default:page-demo:search-table:example-detail',

  /*Quản lý hệ thống*/
  AccountAdd: 'default:system:account:add', // Đã thêm quản lý tài khoản
  AccountEdit: 'default:system:account:edit', // edit quản lý tài khoàn
  AccountDel: 'default:system:account:del', // xóa quản lý tài khoàn

  /*quản lý vai trò*/
  RoleManagerAdd: 'default:system:role-manager:add', // thêm vai trò
  RoleManagerEdit: 'default:system:role-manager:edit', // sữa vai trò
  RoleManagerDel: 'default:system:role-manager:del', // xóa vai trò
  RoleManagerSetRole: 'default:system:role-manager:set-role', // thiết lập quyền

  /*Quản lý menu*/
  MenuAdd: 'default:system:menu:add', // Thêm menu
  MenuEdit: 'default:system:menu:edit', // sữa menu
  MenuDel: 'default:system:menu:del', // xóa menu
  MenuAddLowLevel: 'default:system:menu:addlowlevel', // Thêm menu con

  /*Quản lý bộ phận*/
  DeptAdd: 'default:system:dept:add', // Thêm bộ phận
  DeptEdit: 'default:system:dept:edit', // sữa bộ phận
  DeptDel: 'default:system:dept:del', // xóa bộ phận
  DeptAddLowLevel: 'default:system:dept:addlowlevel', //Quản lý bộ phận Thêm cấp dưới

  /*ActionCode ql datasc*/
  DataScAdd: 'default:system:datasc:add',
  DataScEdit: 'default:system:datasc:edit',
  DataScDel: 'default:system:datasc:del',
  DataScDelAll: 'default:system:datasc:del',

  /* quản lý video hướng dẫn*/
  HuongdanAdd: 'default:system:huongdan:add',
  HuongdanallDel: 'default:system:huongdan:allDel',
  HuongdanUpdate: 'default:system:huongdan:update'
};
