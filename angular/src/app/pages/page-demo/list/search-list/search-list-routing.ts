import { Route } from '@angular/router';

import { ApplicationComponent } from './application/application.component';
import { ArticleComponent } from './article/article.component';
import { ProjectComponent } from './project/project.component';
import { SearchListComponent } from './search-list.component';

export default [
  {
    path: '',
    component: SearchListComponent,
    data: { key: 'search-list' },
    children: [
      { path: 'article', component: ArticleComponent, data: { title: 'Danh sách tìm kiếm (bài viết)', key: 'article' } },
      { path: 'project', component: ProjectComponent, data: { title: 'Danh sách tìm kiếm(Dự án)', key: 'project' } },
      { path: 'application', component: ApplicationComponent, data: { title: 'Danh sách tìm kiếm (Ứng dụng)', key: 'application' } }
    ]
  },

  { path: '', redirectTo: '/search-list', pathMatch: 'full' }
] as Route[];
