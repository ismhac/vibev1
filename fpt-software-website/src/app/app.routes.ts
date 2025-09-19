import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home').then(m => m.HomePageComponent),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about').then(m => m.About),
  },
  {
    path: 'industries',
    loadComponent: () =>
      import('./features/industries').then(m => m.Industries),
  },
  {
    path: 'industries/:id',
    loadComponent: () =>
      import('./features/industry-detail').then(m => m.IndustryDetail),
  },
  {
    path: 'announcements',
    loadComponent: () =>
      import('./features/announcements').then(m => m.Announcements),
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact').then(m => m.Contact),
  },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'unauthorized',
    loadChildren: () => import('./features/unauthorized/unauthorized.module').then(m => m.UnauthorizedModule),
  },
  { path: '**', redirectTo: '/home' }, // Wildcard route for 404 cases
];
