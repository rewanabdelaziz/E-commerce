import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iproduct } from '../../core/models/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  baseurl=environment.apiUrl
  products={}

  constructor(private _httpclient: HttpClient) { }

  getAllProducts():Observable<Iproduct[]>{
  return this._httpclient.get<Iproduct[]>(`${this.baseurl}/products`)
  }

  getAllCategories():Observable<[]>{
  return this._httpclient.get<[]>(`${this.baseurl}/products/categories`)
  }

  getProductsByCategory(category:string):Observable<Iproduct[]>{
  return this._httpclient.get<Iproduct[]>(`${this.baseurl}/products/category/${category}`)
  }

  getProductsById(id:number):Observable<Iproduct>{
  return this._httpclient.get<Iproduct>(`${this.baseurl}/products/${id}`)
  }


}
