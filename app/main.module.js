import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MdCardModule } from '@angular2-material/card';
import { MdToolbarModule } from '@angular2-material/toolbar';

import {
  TestComponent,
  TestListComponent,
  TestDetailComponent,
  HeaderComponent
} from './components';
import { TestsService } from './services/tests.service';
import { TrimPipe } from './pipes';
import { routes } from './components/todo.routes';

@NgModule({
  bootstrap: [TestComponent],
  declarations: [
    TestComponent,
    TestListComponent,
    TestDetailComponent,
    HeaderComponent,
    TrimPipe
  ],
  imports: [
    MdCardModule.forRoot(),
    MdToolbarModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  providers: [
    TestsService
  ]
})
export class MainModule {}
