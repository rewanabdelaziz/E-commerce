import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product, ProductPayload } from '../../core/models/product';
import { Category } from '../../core/models/category';
import { ProductsService } from '../../user/services/products.service';



@Injectable({
  providedIn: 'root'
})
export class AdminProductsService {
  baseurl=environment.apiUrl
  products = signal<Product[]>([])
  _httpclient = inject(HttpClient)
  _ProductsService = inject(ProductsService)

  constructor() { this.getAllProducts(); }

  addNewProduct(product:ProductPayload){
    return this._httpclient.post(`${this.baseurl}products/`,product)
  }

  editProduct(id:number,product:Product){
    return this._httpclient.put(`${this.baseurl}products/${id}`,product)
  }

  deleteProduct(id:number){
    return this._httpclient.delete(`${this.baseurl}products/${id}`)
  }

  getCategoryById(id:number){
    return this._httpclient.get<Category>(`${this.baseurl}categories/${id}`)
  }
  
  searchProductsByTitle(title:string){
    const params = new HttpParams().set('title', title);
    return this._httpclient.get<Product[]>(`${this.baseurl}products/`, { params });
  }

  uploadImage(image:File){
    const formData = new FormData();
    formData.append('file', image);
    return this._httpclient.post<{ location: string }>(`${this.baseurl}files/upload`, formData);
  }

   getAllProducts(){
    this._ProductsService.filterProductsByCategoryAndPrice(null, 0, 2000, 0).subscribe({
      next: (res)=>{
        this.products.set([...this.products(), ...res]);
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

}