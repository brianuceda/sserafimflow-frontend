import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Dashboard } from '../models/dashboard.model';
import { Observable } from 'rxjs/internal/Observable';
import { CurrencyEnum } from '../../../../../shared/data-access/models/enums.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _baseUrl = environment.BACKEND_URL;
  private _httpClient: HttpClient = inject(HttpClient);

  constructor() { }

  getDashboard(targetCurrency?: CurrencyEnum): Observable<Dashboard> {
    let url = `${this._baseUrl}company/dashboard`;

    if (targetCurrency) {
      url += `?targetCurrency=${targetCurrency}`;
    }

    return this._httpClient.get<Dashboard>(url);
  }
}
