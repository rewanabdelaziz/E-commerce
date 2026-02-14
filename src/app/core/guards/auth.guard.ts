import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { Auth, authState } from '@angular/fire/auth';
import { map, take, switchMap } from 'rxjs';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const _auth = inject(Auth);
  const _authService = inject(AuthService);
  const _router = inject(Router);
  const currentPath = state.url;

 
  return authState(_auth).pipe(
    take(1),
    switchMap(user => {
      const isLoggedIn = !!user;
      const role = _authService.userRole();
      
      // if not logged in
      if (!isLoggedIn) {
        if (currentPath.includes('auth')) return of(true);
        _router.navigateByUrl('/auth/login');
        return of(false);
      }

      // if logged in and try to reach auth
      if (currentPath.includes('auth')) {
        _router.navigateByUrl(role === 'admin' ? '/admin' : '/user');
        return of(false);
      }

     
      // guard admin dashboared
      if (currentPath.startsWith('/admin') && role !== 'admin') {
        _router.navigateByUrl('/user');
        return of(false);
      }

     // guard user
      if (currentPath.startsWith('/user') && role !== 'user') {
        _router.navigateByUrl('/admin');
        return of(false);
      }

      return of(true);
    })
  );
};