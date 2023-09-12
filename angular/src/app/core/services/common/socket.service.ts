import { Injectable } from '@angular/core';
import { io,Socket } from 'socket.io-client';
import { localUrl } from '@env/environment';
import { TokenStoreService } from '../store/common-store/token-store.service';
import { ClientEvents, ServerEvents } from '@app/common/events';
import { WindowService } from '@core/services/common/window.service';
import { TokenKey, TokenPre } from '@app/config/constant';
import * as Const from '@app/common/const'
@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket = io(Const.PathSocket, {
    path:  '/socket.io/',
    auth: {
      token: ''
    }
  });

  constructor(
    private tokenStoreService: TokenStoreService
  ) {
    
  }

  setupSocketConnection() {
    this.tokenStoreService.getGlobalTokenStore().subscribe((token)=> {
      this.socket = io(Const.PathSocket, { // + Const.PathSocket
        path:  '/socket.io/',
        auth: {
          token: token
        }
      });
    })
  }

  on(eventName: string, callback: any) {
    this.socket.on(eventName, callback);
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
}
