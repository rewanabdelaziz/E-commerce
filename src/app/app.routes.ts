import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/pageNotFound/pageNotFound.component';
import { authGuard } from './core/guards/auth.guard';
import { homeRedirectGuard } from './core/guards/home-redirect.guard';
import { EmptyComponent } from './shared/components/empty/empty.component';
import { reverseAuthGuard } from './core/guards/reverse-auth.guard';

export const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    component:EmptyComponent,
    canActivate:[homeRedirectGuard]
  },
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
    canActivate:[reverseAuthGuard]
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
