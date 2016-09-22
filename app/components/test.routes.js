import { TestListComponent } from './test-list/test-list.component';
import { SignInHeaderComponent } from './app-header/app-header.component';

export let routes = [
  { path: '', redirectTo: 'tests', pathMatch: 'full' },
  { path: 'tests', component: TestListComponent, pathMatch: 'full' },
  { path: 'login', component: SignInHeaderComponent, pathMatch: 'full' }
];
