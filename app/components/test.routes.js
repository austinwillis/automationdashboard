import { TestListComponent } from './test-list/test-list.component';
import { SignInComponent } from './signin/signin.component';
import { SummaryComponent } from './summary/summary.component';
import { SuitesComponent } from './suites/suites.component';
import { AuthGuard } from '../guards/auth/auth.guard';

export let routes = [
  { path: '', redirectTo: 'tests', pathMatch: 'full' },
  { path: 'tests', component: TestListComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'summary', component: SummaryComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'suites', component: SuitesComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'login', component: SignInComponent, pathMatch: 'full' },
];
