import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Portfolio } from '../../../../../shared/data-access/models/portfolio.model';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PortfoliosService {
  private _baseUrl = environment.BACKEND_URL;

  private _http = inject(HttpClient);

  getAllPortfolios(): Observable<Portfolio[]> {
    return this._http.get<Portfolio[]>(
      `${this._baseUrl}portfolio/get-all-portfolios`
    );
  }

  getPortfolioById(portfolioId: number): Observable<Portfolio> {
    return this._http.get<Portfolio>(
      `${this._baseUrl}portfolio/portfolio-by-id?portfolioId=${portfolioId}`
    );
  }

  createPortfolio(portfolio: Partial<Portfolio>): Observable<any> {
    return this._http.post<any>(
      `${this._baseUrl}portfolio/create-portfolio`,
      portfolio
    );
  }

  updatePortfolio(portfolio: Partial<Portfolio>): Observable<any> {
    return this._http.put<any>(
      `${this._baseUrl}portfolio/update-portfolio`,
      portfolio
    );
  }

  changeDocumentsOfPortfolio(
    portfolioId: number,
    documentsId: number[]
  ): Observable<any> {
    return this._http.put<any>(
      `${this._baseUrl}portfolio/change-documents-of-portfolio`,
      { 
        portfolioId: portfolioId,
        documentsId: documentsId
      }
    );
  }

  // remove-portfolio : param portfolioId
  removePortfolio(portfolioId: number): Observable<any> {
    let url = `${this._baseUrl}portfolio/remove-portfolio?portfolioId=${portfolioId}`;
    return this._http.delete<any>(url);
  }
}
