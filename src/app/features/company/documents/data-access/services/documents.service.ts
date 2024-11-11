import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { StateEnum } from '../../../../../shared/data-access/models/enums.model';
import { Document as SharedDocument } from '../../../../../shared/data-access/models/document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private _baseUrl = environment.BACKEND_URL;

  private _http = inject(HttpClient);

  getAllDocuments(state?: StateEnum): Observable<SharedDocument[]> {
    let url = `${this._baseUrl}document/documents-by-specific-state`;
    if (state !== StateEnum.ALL) {
      url += `?state=${state}`;
    }
    return this._http.get<SharedDocument[]>(url);
  }

  getById(id: string): Observable<Partial<SharedDocument>> {
    return this._http.get<Partial<SharedDocument>>(`${this._baseUrl}document/${id}`);
  }

  createDocument(document: Partial<SharedDocument>): Observable<any> {
    return this._http.post<any>(`${this._baseUrl}document/create`, document);
  }

  editDocument(document: Partial<SharedDocument>): Observable<any> {
    return this._http.put<any>(`${this._baseUrl}document/edit`, document);
  }

  deleteDocument(id: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}document/delete/${id}`);
  }
}
