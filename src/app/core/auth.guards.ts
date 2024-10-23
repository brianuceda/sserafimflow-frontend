import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RoleService } from '../shared/data-access/services/role.service';

export const PrivateGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  let path = window.location.pathname.split('/')[2]?.toLowerCase();

  if (!token) {
    // Validación Empresa
    if (path === 'empresa') {
      router.navigateByUrl('/empresa/iniciar-sesion');
      return false;
    }
    
    // Validación Banco
    else if (path === 'banco') {
      router.navigateByUrl('/banco/iniciar-sesion');
      return false;
    }

    // Cualquier otro caso
    else {
      router.navigateByUrl('/');
      return false;
    }
  }


  return true;
};

export const PublicGuard: CanActivateFn = () => {
  const router = inject(Router);
  const roleService = inject(RoleService);
  const token = localStorage.getItem('token');

  if (token) {
    router.navigateByUrl('/app/dashboard');
    return false;
  }

  return true;
};
