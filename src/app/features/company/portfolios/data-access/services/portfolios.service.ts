import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Portfolio } from '../../../../../shared/data-access/models/portfolio.model';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortfoliosService {
  private _baseUrl = environment.BACKEND_URL;

  private _http = inject(HttpClient);

  getAllPortfolios(): Observable<Portfolio[]> {
    return this._http.get<Portfolio[]>(`${this._baseUrl}portfolio/get-all-portfolios`);
  }
}
