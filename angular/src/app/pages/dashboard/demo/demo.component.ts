import { Component ,ChangeDetectionStrategy, ChangeDetectorRef, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { HuongdanService } from '@app/core/services/http/system/huongdan.service';
import { MenusService } from '@app/core/services/http/system/menus.service';
import { SpinService } from '@app/core/services/store/common-store/spin.service';
import { OptionsInterface, SearchCommonVO } from '@app/core/services/types';
import { AbsComponent } from '@app/pages/system/abs.component';
import { AntTableComponent, AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '@app/shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { YoutubeModalService } from '@app/widget/biz-widget/system/youtube-modal/youtube.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as ConstSocket from '@app/common/constSocket';
import { DemoStoreService, Product } from './demo-store.service';
import { finalize } from 'rxjs';
import { SubdemoService } from '@app/widget/biz-widget/demo/subdemo/subdemo.service';
import { ModalBtnStatus } from '@app/widget/base-modal';
import { NzModalService } from 'ng-zorro-antd/modal';
interface SearchParam {
}
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzButtonModule, AntTableComponent, CardTableWrapComponent]
})
export class DemoComponent extends AbsComponent implements OnInit{

  tableConfig! : AntTableConfig;
  dataList: Product[] = [];
  checkedCashArray: Product[] = [];
  visibleOptions: OptionsInterface[] = [];

  searchParam: Partial<SearchParam> = {};

  constructor(
    protected override cdr: ChangeDetectorRef,
    protected override spinService: SpinService,
    protected override dataService: HuongdanService,
    protected override youtubeModalService: YoutubeModalService,
    protected override router: Router,
    protected override menusService: MenusService,
    private message: NzMessageService,
    private demoStoreService: DemoStoreService,
    private subdemoService: SubdemoService,
    private modalSrv: NzModalService
  ) {
    super(cdr,spinService,dataService,youtubeModalService,router,menusService)
  }


  @ViewChild('oprationTpl', {static: true}) oprationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('idproTpl', {static: true}) idproTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('pronameTpl', {static: true}) pronameTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('priceTpl', {static: true}) priceTpl!: TemplateRef<NzSafeAny>;

  override ngOnInit(): void {
      super.ngOnInit();
      this.initTable();
  }

  reloadTable() : void {

    this.message.info("Đã làm mới");
    this.getDataList();
  }

  add() : void {
     // su ly
    this.subdemoService.show({nzTitle: "Thếm mới"}).subscribe(res => {
      if(!res || res.status === ModalBtnStatus.Cancel) {
        return;
      } 
      const parmas: SearchCommonVO<Product> = {
        pageSize: this.tableConfig.pageSize,
        pageNum:  this.tableConfig.pageIndex,
        data: res.modalValue
      }
      this.demoStoreService.add(parmas);

    })
  }

  delAll() : void {

    // su ly
  }

  edit(id:string, idpro: number, proname:string, price:number): void {
     let reqSubdemo = {
        id: id,
        idpro: idpro,
        proname: proname,
        price: price
     }
    this.subdemoService.show({nzTitle: "Cập nhật"}, reqSubdemo).subscribe(({modalValue, status})=> {
      if(status === ModalBtnStatus.Cancel) {
        return;
      }

      modalValue.id = id;
      const parmas: SearchCommonVO<Product> = {
        pageSize: this.tableConfig.pageSize,
        pageNum:  this.tableConfig.pageIndex,
        data: modalValue
      }
      this.demoStoreService.edit(parmas);
    })
  }

  del(id: string): void {
    this.modalSrv.confirm({
      nzTitle: "Bạn có chắc chắn muốn xóa hay không ?",
      nzContent: "Nhấn OK để xác thực",
      nzOnOk: () => {
        const parmas: SearchCommonVO<Product> = {
          pageSize: this.tableConfig.pageSize,
          pageNum:  this.tableConfig.pageIndex,
          data: id
        }
        this.demoStoreService.del(parmas);
      }
    })

  }

  // kích hoạt kiểm tra thay đổi của bảng
  tableChangeDectction(): void {
    // Thay đổi tham chiếu kích hoạt kiểm tra thay đổi.
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  selectdChecked(event: any[]): void {
    this.checkedCashArray = [...event];

  }

  tableLoading(isLoading: boolean) : void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  changePageSize(event: number): void {
    this.tableConfig.pageSize = event;
  }

  getDataList(e?: NzTableQueryParams) : void {
    const parmas: SearchCommonVO<Product> = {
      pageSize: this.tableConfig.pageSize,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex,
      //filters: this.searchParam,
    }

    this.demoStoreService.sendList(parmas);
    this.demoStoreService.getProductStore()
    .pipe(
      finalize(()=> {
        this.tableLoading(false);
      })
    )
    .subscribe(data=> {
      const {list, total, pageNum} = data;
      this.dataList = [...list];
      this.tableConfig.total = total;
      this.tableConfig.pageIndex = pageNum;
      this.tableLoading(false);
      this.checkedCashArray = [...this.checkedCashArray];
    })



  }

  initTable() :void {
    this.tableConfig = {
      showCheckbox: false,
      headers: [
        {
          title: 'STT',field: 'idpro',width: 180, //tdTemplate: this.idproTpl
        },
        {
          title: "Name",field: 'proname', width: 180, //tdTemplate: this.pronameTpl
        },
        {
          title: "Price", field: 'price', width: 120, //tdTemplate: this.priceTpl
        },
        {
          title: "Actions", tdTemplate: this.oprationTpl, width: 250,  fixed: true, fixedDir: 'right'
        },
      ],
      total: 0,
      loading: true,
      pageSize: 10,
      pageIndex: 1
    }
  }


}
