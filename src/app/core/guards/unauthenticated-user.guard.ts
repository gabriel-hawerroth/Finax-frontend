import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../entities/auth/login.service';

export const UnauthenticatedUserGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  loginService = inject(LoginService),
  router = inject(Router)
) => {
  if (loginService.logged) {
    router.navigateByUrl('home');
    return false;
  }
  return true;
};
