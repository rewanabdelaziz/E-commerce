import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { inject } from '@angular/core';

export const reverseAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {

    if (auth.userRole() === 'admin') {
      router.navigateByUrl('/admin');
    } else {
      router.navigateByUrl('/user');
    }
    return false;
  }

  return true;
};
