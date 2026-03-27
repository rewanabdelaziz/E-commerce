import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { inject } from '@angular/core';

export const reverseAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {

    const role = auth.userRole();
    const target = role === 'admin' ? '/admin' : '/user/home'; 
    if (state.url.includes('auth')) {
      router.navigateByUrl(target);
      return false;
    }
  }

  return true;
};
