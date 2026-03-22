import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/pageNotFound/pageNotFound.component';
import { authGuard } from './core/guards/auth.guard';
import { reverseAuthGuard } from './core/guards/reverse-auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {path: '', redirectTo: 'auth', pathMatch:'full'},
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.adminRoutes),
    canActivate:[authGuard,roleGuard],
    data: { expectedRole: 'admin' }
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.authRoutes),
    canActivate:[reverseAuthGuard]
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./user/user.routes').then((m) => m.userRoutes),
    canActivate:[authGuard,roleGuard],
    data: { expectedRole: 'customer' }
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
