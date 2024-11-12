import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { PurchasedDocument } from '../../../../shared/data-access/models/purchase.model';
import { StateEnum } from '../../../../shared/data-access/models/enums.model';

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
}
