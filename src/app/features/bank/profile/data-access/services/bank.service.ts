import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Bank } from '../../../../../shared/data-access/models/bank.model';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  private _baseUrl = environment.BACKEND_URL;

  constructor(private http: HttpClient) {}

  getBankProfile(): Observable<Bank> {
    return this.http.get<Bank>(`${this._baseUrl}bank/profile`);
  }
}
