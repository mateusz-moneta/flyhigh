import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject, tap } from 'rxjs';
import { Company, SocketData } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: WebSocket;

  private readonly data = new BehaviorSubject<SocketData | null>(null);

  public readonly data$ = this.data.asObservable();

  constructor() {
    this.socket = new WebSocket('ws://207.154.219.113:3000/ws');

    this.connect();
  }

  private connect(): void {
    this.socket.onmessage = (event) => {
      this.data.next(JSON.parse(event.data));
    };

    this.socket.onerror = (error) => {
      console.error('❌ Error:', error);
    };
  }
}
