import { Injectable } from '@angular/core';
import { SocketService } from '@app/core/services/common/socket.service';
import { PageInfo ,Response, SearchCommonVO} from '@app/core/services/types';
import { BehaviorSubject, Observable } from 'rxjs';
import * as ConstSocket from '@app/common/constSocket';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SpinService } from '@app/core/services/store/common-store/spin.service';

export interface Product {
  id: string;
  idpro: number;
  proname: string;
  completed: boolean;
  editing: boolean;
  synced:boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DemoStoreService {

  private productsStore$ = new BehaviorSubject<PageInfo<Product>>({pageNum:1,pageSize:10,total:0,list:[]});

  constructor(
    private socketService: SocketService,
    private moalSrv: NzModalService,
    private spinService: SpinService
  ) {
      this.socketService.setupSocketConnection();
      
      this.socketService.on(ConstSocket.demoListProduct, (res:Response<Product>)=> {
         if(res.code > 0) {
            this.moalSrv.error({nzTitle: 'Thông báo lỗi',nzContent: res.msg});
         } else {
            this.setProductStore(res.data!);
            this.spinService.setCurrentGlobalSpinStore(false);
         }
      })

   }

  sendList(params: SearchCommonVO<Product>) {
    this.spinService.setCurrentGlobalSpinStore(true)
    this.socketService.emit(ConstSocket.demoListProduct, params);
  }

  add(params: SearchCommonVO<Product>) {
    this.spinService.setCurrentGlobalSpinStore(true);
    this.socketService.emit(ConstSocket.demoCreatePorduct,params);
  }

  edit(params: SearchCommonVO<Product>) {
    this.spinService.setCurrentGlobalSpinStore(true);
    this.socketService.emit(ConstSocket.demoUpdatePorduct, params);
  }

  del(params: SearchCommonVO<Product>) {
    this.spinService.setCurrentGlobalSpinStore(true);
    this.socketService.emit(ConstSocket.demoDeletePorduct, params);
  }

  setProductStore(productStore: PageInfo<Product>) {
     this.productsStore$.next(productStore);
  }

  getProductStore(): Observable<PageInfo<Product>> {
     return this.productsStore$.asObservable();
  }
}
