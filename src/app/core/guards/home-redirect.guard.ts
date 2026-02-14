import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';

export const homeRedirectGuard: CanActivateFn = (route, state) => {
  const _auth = inject(AuthService);
  const _router = inject(Router);

  if (!_auth.isLoggedIn()) {
    _router.navigateByUrl('/auth/login');
    return false;
  }

  if (_auth.userRole() === 'admin') {
    _router.navigateByUrl('/admin');
  } else {
    _router.navigateByUrl('/user');
  }

  return false;
};
