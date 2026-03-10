import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../core/models/product';


@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {
  baseurl=environment.apiUrl
  constructor(private _httpclient: HttpClient) { }
  AddNewProduct(product:Product){
    return this._httpclient.post(`${this.baseurl}/products`,product)
  }
}
