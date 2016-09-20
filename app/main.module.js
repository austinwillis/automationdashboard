import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import {
  AppComponent,
  TodoListComponent
} from './components';
import { TestsService } from './services/tests.service';
import { TrimPipe } from './pipes';
import { routes } from './components/todo.routes';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    TodoListComponent,
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
    TestsService,
    { provide: 'AUTHOR', useValue: 'Soós Gábor' }
  ]
})
export class MainModule {}
