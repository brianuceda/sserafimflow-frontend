import { Injectable } from '@angular/core';

export interface TokenPayload {
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  public isCompany(): boolean {
    const decodedToken = this.decodeJwtPayload();
    return decodedToken?.role === 'COMPANY';  
  }

  public isBank(): boolean {
    const decodedToken = this.decodeJwtPayload();
    return decodedToken?.role === 'BANK';    
  }
  
  public decodeJwtPayload(): TokenPayload | null {
    const jwtToken = localStorage.getItem('token');

    if (jwtToken) {
      try {
        const payloadBase64 = jwtToken.split('.')[1];
        const payloadJson = atob(payloadBase64);
        return JSON.parse(payloadJson);
      } catch (err) {
        console.error('Error decodificando el token de autenticacion: ', err);
        return null;
      }
    } else {
      return null;
    }
  }
}
