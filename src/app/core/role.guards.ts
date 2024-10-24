import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JWTService } from '../shared/data-access/services/jwt.service';

export interface TokenPayload {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

export const CompanyGuard: CanActivateFn = () => {
  const _router = inject(Router);
  const _jwtService = inject(JWTService);
  const token = localStorage.getItem('token');

  console.log('Validando token...');

  if (!token) {
    console.log('Token inválido');
    _router.navigateByUrl('/empresa/iniciar-sesion');
    return false;
  }

  return new Promise<boolean>((resolve) => {
    _jwtService.isValidToken().subscribe((isValid: boolean) => {
      if (!isValid) {
        console.log('Token inválido');
        _jwtService.removeToken();
        _jwtService.returnToHome();
        resolve(false);
        return;
      }

      if (_jwtService.isBank()) {
        console.log('Token de Empresa inválido');
        _router.navigateByUrl('/app/banco/dashboard');
        resolve(false);
        return;
      }

      if (!_jwtService.isCompany() && !_jwtService.isBank()) {
        console.log('Token inválido');
        _jwtService.removeToken();
        _jwtService.returnToHome();
        resolve(false);
        return;
      }

      console.log('Token válido');

      resolve(true);
    });
  });
};

export const BankGuard: CanActivateFn = () => {
  const _router = inject(Router);
  const _jwtService = inject(JWTService);
  const token = localStorage.getItem('token');

  console.log('Validando token...');

  if (!token) {
    _router.navigateByUrl('/banco/iniciar-sesion');
    console.log('Token inválido');
    return false;
  }

  return new Promise<boolean>((resolve) => {
    _jwtService.isValidToken().subscribe((isValid: boolean) => {
      if (!isValid) {
        console.log('Token inválido');
        _jwtService.removeToken();
        _jwtService.returnToHome();
        resolve(false);
        return;
      }

      if (_jwtService.isCompany()) {
        console.log('Token de Banco inválido');
        _router.navigateByUrl('/app/empresa/dashboard');
        resolve(false);
        return;
      }

      if (!_jwtService.isCompany() && !_jwtService.isBank()) {
        console.log('Token inválido');
        _jwtService.removeToken();
        _jwtService.returnToHome();
        resolve(false);
        return;
      }

      console.log('Token válido');

      resolve(true);
    });
  });
};