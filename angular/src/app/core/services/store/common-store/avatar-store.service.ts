import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AvatarStoreService {
  private avatarlink$ = new BehaviorSubject<string>("");

  constructor() { }

  setAvatarStore(avatarlink : string) : void {
    this.avatarlink$.next(avatarlink);
  }

  getAvatarStore(): Observable<string> {
    return this.avatarlink$.asObservable();
  }
}
