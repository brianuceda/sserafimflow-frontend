import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { PurchasedDocument } from '../../../../shared/data-access/models/purchase.model';
import { RateTypeEnum, StateEnum } from '../../../../shared/data-access/models/enums.model';
import { PurchaseEquations } from '../models/ecuations.model';

export interface RegisterPurchase {
  bankId: number;
  documentId: number;
  rateType: RateTypeEnum;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private _baseUrl = environment.BACKEND_URL;

  private _http = inject(HttpClient);

  getAllDocumentsPurchased(state: StateEnum): Observable<PurchasedDocument[]> {
    let url = `${this._baseUrl}purchase/purchases-by-specific-state`;
    if (state !== StateEnum.ALL) {
      url += `?state=${state}`;
    }
    return this._http.get<PurchasedDocument[]>(url);
  }

  calculatePurchase(bankId: number, documentId: number, rateType: string | null): Observable<PurchaseEquations> {
    let url = `${this._baseUrl}purchase/calculate-purchase`;
    url += `?bankId=${bankId}&documentId=${documentId}&rateType=${rateType}`;
    return this._http.get<PurchaseEquations>(url);
  }

  sellDocument(bankId: number, documentId: number, rateType: string | null): Observable<any> {
    let url = `${this._baseUrl}purchase/sell-document`;
    url += `?bankId=${bankId}&documentId=${documentId}&rateType=${rateType}`;
    return this._http.post<any>(url, {});
  }
}
