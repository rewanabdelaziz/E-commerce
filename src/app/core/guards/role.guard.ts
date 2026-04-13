import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];
  const rolesArray = Array.isArray(expectedRole) ? expectedRole : [expectedRole];

  if (!auth.isLoggedIn() && rolesArray.includes('guest')) {
    return true; 
  }

  if(!auth.isLoggedIn()){
    router.navigate(['auth/login'])
    return false;
    
  }
 
  if (rolesArray.includes(auth.userRole())) {
    return true;
  }

  if ( auth.userRole() == 'admin') {
    router.navigate(['/admin']);
  } else {
    router.navigate(['/user/home']);
  }
  return false;
};
