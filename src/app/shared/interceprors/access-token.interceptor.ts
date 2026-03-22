import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { CryptoService } from '../../auth/service/crypto.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';

export const accessTokenInterceptor: HttpInterceptorFn = (req, next) => {
  let _cryptoService = inject(CryptoService)
  let _auth = inject(AuthService)
  let modifiesReq = req
  let access_token = localStorage.getItem('access_token')
  
  if (access_token && !req.url.includes('/auth/login') && !req.url.includes('/user') && !req.url.includes('auth/refresh-token')){

    access_token =_cryptoService.decrypt(access_token)
    modifiesReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access_token}`
      }
    })
    return next(modifiesReq).pipe(
      tap({
        error: (err) => {
          if (err.status === 401) {
            _auth.refreshAccessToken();
          }
        }
      })
    );
    
    
  }
  


  return next(req)
};
