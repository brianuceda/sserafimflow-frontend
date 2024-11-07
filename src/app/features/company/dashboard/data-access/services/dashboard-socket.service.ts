import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import { environment } from '../../../../../../environments/environment';
import { toast } from 'ngx-sonner';
import { Subject } from 'rxjs/internal/Subject';

(window as any).global = window;

@Injectable({
  providedIn: 'root'
})
export class DashboardSocketService {
  private _baseUrl = environment.BACKEND_BASE_URL;
  private _stompClient!: Stomp.Client;
  private dashboardUpdates = new Subject<any>();

  constructor() {
    this.connect();
  }

  async connect() {
    const SockJS = (await import('sockjs-client')).default; // Importa SockJS dinámicamente
    const socket = new SockJS(`${this._baseUrl}ws`);

    this._stompClient = new Stomp.Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    this._stompClient.onConnect = () => {
      this._stompClient.subscribe('/topic/dashboard', (message) => {
        if (message.body) {
          this.dashboardUpdates.next(JSON.parse(message.body));
          toast.info('Información actualizada');
        }
      });
    };

    this._stompClient.activate();
  }

  getDashboardUpdates() {
    return this.dashboardUpdates.asObservable();
  }
}
