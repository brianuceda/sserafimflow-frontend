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
}
