import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService } from '../shared/data-access/services/role.service';

export interface TokenPayload {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

export const CompanyGuard: CanActivateFn = () => {
  const router = inject(Router);
  const roleService = inject(RoleService);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }

  if (!roleService.isCompany()) {
    router.navigateByUrl('/app/dashboard');
    return false;
  }

  return true;
};

export const BankGuard: CanActivateFn = () => {
  const router = inject(Router);
  const roleService = inject(RoleService);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigateByUrl('/login');
    return false;
  }

  if (!roleService.isBank()) {
    router.navigateByUrl('/app/dashboard');
    return false;
  }

  return true;
};