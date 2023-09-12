import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { Addon, Graph } from '@antv/x6';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-flow-chat',
  templateUrl: './flow-chat.component.html',
  styleUrls: ['./flow-chat.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent, NzCardModule, NzResultModule, NzGridModule, NzButtonModule, NzToolTipModule, NzIconModule]
})
export class FlowChatComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Trình soạn thảo quy trình, với biểu đồ luồng, tôi nên biết phải làm gì trong tương lai',
    breadcrumb: ['Home', 'tiện ích mở rộng', 'biên tập đồ họa', 'sơ đồ'],
    desc: 'Một bức tranh đáng giá cả ngàn lời nói và sơ đồ là một cách hay để thể hiện ý tưởng thuật toán (ví dụ sơ đồ đơn giản, các chức năng cụ thể cần phải tự cải thiện, antV x6)(简单流程图示例,具体功能需要自己完善，antV x6)'
  };
  graph!: Graph;
  @ViewChild('container') container!: ElementRef;

  /** Một số thuộc tính cơ bản của canvas x6*/
  graphBasicConfig = {
    grid: {
      size: 10, // kích thước lưới 10px
      visible: true // hiển thị nền lưới
    },
    panning: true, // kéo vải
    selecting: true,
    height: 400,
    connecting: {
      snap: true, // Trong quá trình kết nối, quá trình hấp phụ tự động sẽ được kích hoạt khi khoảng cách là 50px từ nút hoặc cọc kết nối.
      allowBlank: false, // Có cho phép các điểm được kết nối với các vị trí trống trên khung vẽ hay không
      allowLoop: false, // Có cho phép tạo liên kết vòng tròn hay không, tức là nút đầu và nút cuối của cạnh là cùng một nút
      allowNode: false, // Có cho phép các cạnh liên kết với các nút hay không (liên kết sơ khai trên các nút không phải nút)
      allowEdge: false, // Liệu một cạnh có được phép liên kết với một cạnh khác hay không
      connector: 'rounded',
      connectionPoint: 'boundary'
    }
  };

  constructor() {}

  ngOnInit(): void {}

  drag(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const shap = target.getAttribute('shap')!;

    const dnd = new Addon.Dnd({
      target: this.graph
    });

    const node = this.graph.createNode({
      width: 100,
      height: 100,
      shape: shap,
      ports: {
        groups: {
          //Nhập định nghĩa nhóm sơ khai liên kết
          in: {
            position: 'top',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff'
              }
            }
          },
          //Định nghĩa nhóm cổ phần liên kết đầu ra
          out: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff'
              }
            }
          }
        },
        items: [
          {
            id: 'port1',
            group: 'in'
          },
          {
            id: 'port2',
            group: 'in'
          },
          {
            id: 'port3',
            group: 'in'
          },
          {
            id: 'port4',
            group: 'out'
          },
          {
            id: 'port5',
            group: 'out'
          }
        ]
      },
      attrs: {
        body: {
          // fill: '#ccc'
        }
      }
    });
    dnd.start(node, event);
  }

  initGraph(): void {
    const graphConfig = {
      ...this.graphBasicConfig,
      container: this.container.nativeElement
    };
    this.graph = new Graph(graphConfig);
  }

  ngAfterViewInit(): void {
    this.initGraph();
  }
}
