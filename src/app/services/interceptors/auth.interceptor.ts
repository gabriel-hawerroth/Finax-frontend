import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UtilsService } from '../../utils/utils.service';
import { LoginService } from '../login.service';

export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
  loginService = inject(LoginService),
  utilsService = inject(UtilsService)
) => {
  const requestUrl: Array<string> = request.url.split('/');
  const apiUrl: Array<string> = environment.baseApiUrl.split('/');

  if (requestUrl[2] === apiUrl[2]) {
    const token: string | null = loginService.getUserToken;

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next(request).pipe(
      catchError((error) => {
        console.log('Error: ', error);

        switch (error.status) {
          case 401:
            loginService.logout(true);
            break;
          case 0:
            loginService.logout(false);
            utilsService.showMessage('generic.update-in-progress');
        }

        return throwError(() => error);
      })
    );
  } else {
    return next(request);
  }
};
