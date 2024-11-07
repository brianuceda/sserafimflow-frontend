import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth-response.model';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';
import { Company } from '../../../shared/data-access/models/company.model';
import { Bank } from '../../../shared/data-access/models/bank.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _baseUrl = environment.BACKEND_URL;
  private _httpClient: HttpClient = inject(HttpClient);

  bankLogin(signInData: Partial<Bank>, rememberMe: boolean): Observable<any> {
    const formData = new FormData();

    formData.append('dto', new Blob([JSON.stringify(signInData)], { type: 'application/json' }));
    if (rememberMe) {
      formData.append('rememberMe', JSON.stringify(rememberMe));
    }

    return this._httpClient.post<AuthResponse>(`${this._baseUrl}auth/bank/login`, formData);
  }

  bankRegister(signUpData: Partial<Bank>, imageUploaded: File, rememberMe: boolean): Observable<AuthResponse> {
    const formData = new FormData();

    formData.append('dto', new Blob([JSON.stringify(signUpData)], { type: 'application/json' }));
    if (imageUploaded) {
      formData.append('image', imageUploaded);
    }
    if (rememberMe) {
      formData.append('rememberMe', JSON.stringify(rememberMe));
    }

    return this._httpClient.post<AuthResponse>(`${this._baseUrl}auth/bank/register`, formData);
  }

  companyLogin(signInData: Partial<Company>, rememberMe: boolean): Observable<any> {
    const formData = new FormData();

    formData.append('dto', new Blob([JSON.stringify(signInData)], { type: 'application/json' }));
    if (rememberMe) {
      formData.append('rememberMe', JSON.stringify(rememberMe));
    }

    return this._httpClient.post<AuthResponse>(`${this._baseUrl}auth/company/login`, formData);
  }

  companyRegister(signUpData: Partial<Company>, imageUploaded: File | null, rememberMe: boolean): Observable<AuthResponse> {
    const formData = new FormData();

    formData.append('dto', new Blob([JSON.stringify(signUpData)], { type: 'application/json' }));
    if (imageUploaded) {
      formData.append('image', imageUploaded);
    }
    if (rememberMe) {
      formData.append('rememberMe', JSON.stringify(rememberMe));
    }

    return this._httpClient.post<AuthResponse>(`${this._baseUrl}auth/company/register`, formData);
  }


  logOut(): Observable<any> {
    return this._httpClient.post(`${this._baseUrl}auth/logout`, {});
  }
}
