import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { YouTubePlayerModule } from "@angular/youtube-player";
import { NzSafeAny } from "ng-zorro-antd/core/types";
import { NzModalRef } from "ng-zorro-antd/modal";
import { Observable, of } from "rxjs";

@Component({
    selector: 'app-youtube',
    templateUrl: './youtube.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        YouTubePlayerModule,
    ]
})

export class YoutubeComponent implements OnInit{
    apiLoaded = false;

    params!: any;

    videoId = 'cH_T9iFJ1kw';
    height = 400;
    width = 670;

    startSeconds = 0;
    endSeconds = 120;

    constructor(
        private modalRef: NzModalRef,
        private fb: FormBuilder,
        private cdf : ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        if(this.params.idvideo != undefined && this.params.idvideo.length > 0) {
            this.videoId = this.params.idvideo;
        }

        if (!this.apiLoaded) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            this.apiLoaded = true;
        }
    }

    protected getAsyncFnData(modalValue: NzSafeAny): Observable<NzSafeAny> {
        return of(modalValue);
    }
}