import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Bank } from '../../../../../shared/data-access/models/bank.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class BanksService {
  private _baseUrl = environment.BACKEND_URL;

  private _http = inject(HttpClient);

  getAllBanksAssociated(): Observable<Bank[]> {
    return this._http.get<Bank[]>(`${this._baseUrl}bank/all-banks-associated`);
  }

}
