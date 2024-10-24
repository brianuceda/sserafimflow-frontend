import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private _baseUrl = environment.BACKEND_URL;

  constructor(private http: HttpClient) {}

  getCompanyProfile(): Observable<Company> {
    return this.http.get<Company>(`${this._baseUrl}company/profile`);
  }
}
