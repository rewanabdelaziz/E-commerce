import { Injectable, signal } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  // use reqCount variable to delay spinner hide in case of two requests are followed
  private reqCount = 0
   isLoading = signal<boolean>(false)

  show() {
    this.reqCount ++;
    this.isLoading.set(true);
  }

  hide() {
    this.reqCount --;
    if(this.reqCount <=0){
      this.reqCount = 0;
      this.isLoading.set(false);
    }
    
  }
}
