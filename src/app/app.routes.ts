import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/pageNotFound/pageNotFound.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.adminRoutes),
    canActivate:[authGuard]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes),
    canActivate:[authGuard]
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.routes').then((m) => m.userRoutes),
    canActivate:[authGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
