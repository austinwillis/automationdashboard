import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import {
  TestComponent,
  TestListComponent
} from './components';
import { TestsService } from './services/tests.service';
import { TrimPipe } from './pipes';
import { routes } from './components/todo.routes';

@NgModule({
  bootstrap: [TestComponent],
  declarations: [
    TestComponent,
    TestListComponent,
    TrimPipe
  ],
  imports: [
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
