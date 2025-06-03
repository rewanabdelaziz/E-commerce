import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

baseurl=environment.apiUrl

  constructor(private _httpclient: HttpClient) { }
  getAllCarts(prms?:any){
    if(prms){
      let params = new HttpParams()
      params = params.append("startdate", prms?.start).append("enddate", prms?.end)
      return this._httpclient.get(`${this.baseurl}/carts`,{params})
    }else{
      return this._httpclient.get(`${this.baseurl}/carts`)
    }
  }

  deleteCart(id:number){
    return this._httpclient.delete(`${this.baseurl}/carts/${id}`)
  }


}
