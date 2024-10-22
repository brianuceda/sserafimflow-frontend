import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth-response.model';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';
import { ModelCompanyLogin } from '../models/company-login.model';
import { ModelCompanyRegister } from '../models/company-register.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _baseUrl = environment.BACKEND_URL;
  private _httpClient: HttpClient = inject(HttpClient);

  companyLogin(signInData: ModelCompanyLogin): Observable<any> {
    return this._httpClient.post(`${this._baseUrl}auth/company/login`, signInData);
  }

  companyRegister(signUpData: ModelCompanyRegister): Observable<AuthResponse> {
    return this._httpClient.post(`${this._baseUrl}auth/company/register`, signUpData);
  }

  bankLogin(signInData: ModelCompanyLogin): Observable<any> {
    return this._httpClient.post(`${this._baseUrl}auth/bank/login`, signInData);
  }

  bankRegister(signUpData: ModelCompanyRegister): Observable<AuthResponse> {
    return this._httpClient.post(`${this._baseUrl}auth/bank/register`, signUpData);
  }

  logOut(): Observable<any> {
    return this._httpClient.post(`${this._baseUrl}auth/logout`, {});
  }
}
