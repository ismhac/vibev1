import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from '../../core/guards/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AdminGuard],
        children: [
          {
            path: '',
            component: AdminDashboardComponent
          },
          {
            path: 'users',
            loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
          },
          {
            path: 'industries',
            loadComponent: () => import('./industries/industries.component').then(m => m.IndustriesComponent)
          },
          {
            path: 'announcements',
            loadComponent: () => import('./announcements/announcements.component').then(m => m.AnnouncementsComponent)
          }
        ]
      }
    ])
  ]
})
export class AdminModule { }
