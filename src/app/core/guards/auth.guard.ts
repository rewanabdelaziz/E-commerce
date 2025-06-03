import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService)
  const _router = inject(Router)
  const islogged :boolean =_authService.isLoggedIn()
  const user = _authService.getCurrentUser();
  const currentPath = state?.url;

  if(!islogged){
    _router.navigateByUrl('/auth/login')
    return false;
  }else if (currentPath?.startsWith('admin') && user?.role !== 'admin') {
    _router.navigateByUrl('/user');
    return false;
  }else if (currentPath?.startsWith('user') && user?.role !== 'user') {
    _router.navigateByUrl('/admin');
    return false;
  }else{
    return true;
  }




};
