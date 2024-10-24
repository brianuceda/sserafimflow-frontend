import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const PublicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    router.navigateByUrl('/app/dashboard');
    return false;
  }

  return true;
};
