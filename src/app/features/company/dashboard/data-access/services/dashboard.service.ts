import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Dashboard } from '../models/dashboard.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _baseUrl = environment.BACKEND_URL;
  private _httpClient: HttpClient = inject(HttpClient);

  constructor() { }

  getDashboard(targetCurrency: 'PEN' | 'USD'): Observable<Dashboard> {
    return this._httpClient.get<Dashboard>(`${this._baseUrl}company/dashboard?targetCurrency=${targetCurrency}`);
  }
}
