import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IcartModel } from '../../core/models/IcartModel';

@Injectable({
  providedIn: 'root'
})
export class UserCartService {
  baseurl=environment.apiUrl

  constructor(private _httpclient: HttpClient) { }

  createNewCart(model:IcartModel){
    return this._httpclient.post(`${this.baseurl}/carts`,model)
  }

}
