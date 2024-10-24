import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';

export interface TokenPayload {
  sub: string;
  image: string;
  realName: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class JWTService {
  private _baseUrl = environment.BACKEND_URL;
  private _router = inject(Router);
  private _httpClient = inject(HttpClient);

  private decodeBase64ToUtf8(base64: string): string {
    try {
      return decodeURIComponent(escape(atob(base64)));
    } catch (err) {
      console.error('Error decodificando el string Base64:', err);
      return '';
    }
  }

  public decodeJwtPayload(): TokenPayload | null {
    const jwtToken = localStorage.getItem('token');

    if (jwtToken) {
      try {
        const payloadBase64 = jwtToken.split('.')[1];
        const payloadJson = this.decodeBase64ToUtf8(payloadBase64);
        const jsonPayload = JSON.parse(payloadJson);
        return jsonPayload;
      } catch (err) {
        console.error('Error decodificando el token');
        return null;
      }
    } else {
      return null;
    }
  }
  public isCompany(): boolean {
    const decodedToken = this.decodeJwtPayload();
    return decodedToken?.role === 'COMPANY';
  }

  public isBank(): boolean {
    const decodedToken = this.decodeJwtPayload();
    return decodedToken?.role === 'BANK';
  }

  public getRealName(): string | undefined {
    const decodedToken = this.decodeJwtPayload();
    return decodedToken?.realName || undefined;
  }

  public getUsername(): string | undefined {
    const decodedToken = this.decodeJwtPayload();
    return decodedToken?.sub || undefined;
  }

  public getImage(): string | undefined {
    const decodedToken = this.decodeJwtPayload();
    return decodedToken?.image || undefined;
  }

  public isValidToken(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('Token no existe');
      return new Observable<boolean>(observer => {
        observer.next(false);
        observer.complete();
      })
    }

    return this._httpClient.get<boolean>(this._baseUrl + 'general/is-valid-token')
      .pipe(
        map(() => {
          return true;
        }),
        catchError((error) => {
          if (error.status !== 200) {
            return new Observable<boolean>(observer => {
              observer.next(false);
              observer.complete();
            })
          }

          console.log('Error validando token');
          return new Observable<boolean>(observer => {
            observer.next(false);
            observer.complete();
          })
        })
      )
  }

  public removeToken() {
    localStorage.removeItem('token');
  }

  public returnToHome() {
    let url = this._router.url;

    if (url.startsWith('/app/empresa')) {
      this.navigate('/empresa/iniciar-sesion');
    } else if (url.startsWith('/app/banco')) {
      this.navigate('/banco/iniciar-sesion');
    } else {
      this.navigate('/');
    }
  }

  private navigate(route: string) {
    setTimeout(() => {
      this._router.navigate([route]);
      setTimeout(() => {
        document.getElementById('hs-offcanvas-custom-backdrop-color-backdrop')?.remove();
      }, 50);
    }, 300);
  }
}
