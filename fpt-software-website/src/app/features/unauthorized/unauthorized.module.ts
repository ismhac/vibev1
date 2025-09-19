import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UnauthorizedComponent } from './unauthorized.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'unauthorized',
        component: UnauthorizedComponent
      }
    ])
  ]
})
export class UnauthorizedModule { }
