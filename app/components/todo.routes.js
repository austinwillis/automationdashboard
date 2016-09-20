import { TestListComponent } from './test-list/test-list.component';

export let routes = [
  { path: '', component: TestListComponent, pathMatch: 'full' },
  { path: ':status', component: TestListComponent }
];
