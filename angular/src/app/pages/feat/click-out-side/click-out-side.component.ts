import { DOCUMENT } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, ViewChild, AfterViewInit, ElementRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { fnStopMouseEvent } from '@utils/tools';

@Component({
  selector: 'app-click-out-side',
  templateUrl: './click-out-side.component.html',
  styleUrls: ['./click-out-side.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PageHeaderComponent]
})
export class ClickOutSideComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Nhấp vào các sự kiện kích hoạt bên trong và bên ngoài, nhấp vào chúng và bạn sẽ luôn gặp may mắn',
    breadcrumb: ['Home', 'Chưc năng', 'ClickOutSide']
  };
  destroyRef = inject(DestroyRef);
  text: string = 'bấm vào bên trong hoặc bên ngoài';
  winClick$!: Observable<Event>; // Liên kết sự kiện nhấp chuột của cửa sổ
  @ViewChild('targetHtml') targetHtml!: ElementRef;
  targetHtmlClick$!: Observable<any>;

  constructor(private cdr: ChangeDetectorRef, @Inject(DOCUMENT) private doc: Document) {}

  ngAfterViewInit(): void {
    this.targetHtmlClick$ = fromEvent(this.targetHtml.nativeElement, 'click').pipe(
      tap(e => {
        fnStopMouseEvent(<MouseEvent>e);
        this.text = 'Dùng dao chặt thịt';
      })
    );
    this.winClick$ = fromEvent(this.doc, 'click').pipe(
      tap(() => {
        this.text = 'Trái tim và tâm hồn';
      })
    );
    merge(this.targetHtmlClick$, this.winClick$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {}
}
