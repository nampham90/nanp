import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzHighlightModule } from 'ng-zorro-antd/core/highlight';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';

import { MenuTreeSearchService } from './menu-tree-search.service';
import { FlatNode, MenuTreeService } from './menu-tree.service';

@Component({
  selector: 'app-menu-tree',
  templateUrl: './menu-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MenuTreeService, MenuTreeSearchService],
  standalone: true,
  imports: [NzCardModule, NzButtonModule, NzInputModule, FormsModule, NzIconModule, NzTreeViewModule, NzHighlightModule]
})
export class MenuTreeComponent implements OnInit {
  selectListSelection: SelectionModel<FlatNode>;
  treeControl: FlatTreeControl<FlatNode>;
  @Output() readonly menutIdEven = new EventEmitter<number>();

  constructor(public menutreesearchService: MenuTreeSearchService, public menutreeService: MenuTreeService) {
    this.selectListSelection = this.menutreeService.selectListSelection;
    this.treeControl = this.menutreeService.treeControl;
  }

  changeSearch(event: string): void {
    this.menutreesearchService.searchValue$.next(event);
  }

  clickNode(node: FlatNode): void {
    this.menutreeService.clickNode(node);
    this.menutIdEven.emit(node.id);
  }

  resetTree(): void {
    this.menutreeService.resetTree();
  }

  ngOnInit(): void {
    this.menutreeService.initDate();
  }
}
