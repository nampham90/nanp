import { Route } from '@angular/router';

import { ActionCode } from '@config/actionCode';

import { SearchTableDetailComponent } from './search-table-detail/search-table-detail.component';
import { SearchTableComponent } from './search-table.component';

export default [
  {
    path: '',
    component: SearchTableComponent,
    data: { title: 'Mẫu yêu cầu', key: 'search-table' }
  },
  {
    path: 'search-table-detail/:name/:age',
    component: SearchTableDetailComponent,
    data: {
      title: 'Mẫu yêu cầu',
      authCode: ActionCode.SearchTableDetail,
      key: 'search-table-detail'
    }
  }
] as Route[];
