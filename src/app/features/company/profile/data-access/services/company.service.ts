import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Company } from '../../../../../shared/data-access/models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private _baseUrl = environment.BACKEND_URL;

  private _http = inject(HttpClient);

  getCompanyProfile(): Observable<Company> {
    return this._http.get<Company>(`${this._baseUrl}company/profile`);
  }

  updateCompanyProfile(company: Partial<Company>): Observable<any> {
    return this._http.put<any>(`${this._baseUrl}company/update-profile`, company);
  }
}
