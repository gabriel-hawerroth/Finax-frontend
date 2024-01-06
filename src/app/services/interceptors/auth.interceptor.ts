import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginService } from '../login.service';
import { UtilsService } from '../../utils/utils.service';

const getToken = (): string => {
  return inject(LoginService).getUserToken;
};

export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
  loginService = inject(LoginService),
  utilsService = inject(UtilsService)
) => {
  let token: string = getToken();

  const requestUrl: Array<string> = request.url.split('/');
  const apiUrl: Array<string> = environment.baseApiUrl.split('/');

  if (requestUrl[2] === apiUrl[2]) {
    if (token !== '') {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next(request).pipe(
      catchError((error) => {
        console.log('Error: ', error);
        
        const errorResponse = {
          status: error.status,
          message: error.error?.message || 'Unknown error occurred',
          error: error,
        };

        if ((error.status === 401)) {
          loginService.logout(true);
        } else if (error.status === 0) {
          loginService.logout(false);

          utilsService.showSimpleMessage(
            utilsService.getUserConfigs.language === 'pt-br'
              ? 'Atualização em andamento, tente novamente mais tarde'
              : 'Update in progress, please try again later'
          );
        }
        
        if (error.error.error_description === 'Bad credentials') {
          utilsService.showSimpleMessage(
            utilsService.getUserConfigs.language === 'pt-br'
              ? 'Login inválido'
              : 'Invalid login'
          );
        } else if (error.error.error_description === 'Inactive user') {
          utilsService.showSimpleMessage(
            utilsService.getUserConfigs.language === 'pt-br'
              ? 'Usuário inativo, verifique seu email'
              : 'Inactive user, check your email'
          );
        }

        return throwError(() => error);
      })
    );
  } else {
    return next(request);
  }
};
