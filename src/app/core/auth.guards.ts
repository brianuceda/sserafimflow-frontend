import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const PrivateGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('buscando token: ' + token);

  if (!token) {
    // router.navigateByUrl('/login');
    return true; // false
  }

  return true;
};

export const PublicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // router.navigateByUrl('/app/dashboard');
    return true; // false
  }

  return true;
};
