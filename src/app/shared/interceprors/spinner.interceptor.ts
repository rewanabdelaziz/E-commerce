import { HttpInterceptorFn } from '@angular/common/http';
import { SpinnerService } from '../services/spinner.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);

  spinnerService.show();

  return next(req).pipe(
    finalize(() => spinnerService.hide())
  );
};
