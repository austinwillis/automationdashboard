import { TestListComponent } from './test-list/test-list.component';
import { SignInComponent } from './signin/signin.component';
import { AuthGuard } from '../guards/auth/auth.guard';

export let routes = [
  { path: '', redirectTo: 'tests', pathMatch: 'full' },
  { path: 'tests', component: TestListComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'login', component: SignInComponent, pathMatch: 'full' }
];
