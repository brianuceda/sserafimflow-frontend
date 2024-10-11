import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ModelCompanySignIn } from '../models/company-sign-in.model';
import { ModelCompanySignUp } from '../models/company-sign-up.model';
import { AuthResponse } from '../models/auth-response.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _baseUrl = environment.BACKEND_URL;
  private _httpClient: HttpClient = inject(HttpClient);

  login(signInData: ModelCompanySignIn): Observable<AuthResponse> {
    return this._httpClient.post(`${this._baseUrl}auth/login`, {
      email: signInData.email,
      password: signInData.password,
      role: signInData.role,
    });
  }

  register(signUpData: ModelCompanySignUp): Observable<AuthResponse> {
    return this._httpClient.post(`${this._baseUrl}auth/register`, {
      email: signUpData.email,
      password: signUpData.password,
      role: signUpData.role,
      companyName: signUpData.companyName,
      ruc: signUpData.ruc,
    });
  }

  logOut(): Observable<any> {
    return this._httpClient.post(`${this._baseUrl}auth/logout`, {});
  }

  signInWithGoogle() {
    return this._httpClient.get(`${this._baseUrl}auth/google`);
  }
}
