import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../core/models/product';
import { Category } from '../../core/models/category';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private _http=inject(HttpClient);
  baseurl=environment.apiUrl
  products =signal<Product[]>([]);
  categories = signal<Category[]>([]);
  limit = signal<number>(9);

  constructor() { 
    this.getAllCategories(5).subscribe({
      next: (res) =>{
        this.categories.set(res)
        // console.log(this.categories())
      },
      error: (err) =>{
        console.log(err)
      }
    })

    this.getLimitedProducts(this.limit()).subscribe({
      next: (res) =>{
        this.products.set(res)
        // console.log(this.products())
      },
      error: (err) =>{
        console.log(err)
      }
    })
   
  }




  getLimitedProducts(count: number = 5, offset: number = 15): Observable<Product[]> {
    const params = new HttpParams()
    .set('limit', count.toString())
    .set('offset', offset.toString());
    return this._http.get<Product[]>(`${this.baseurl}products`, { params });
  }

 
  getProductsById(id: number): Observable<Product> {
   return this._http.get<Product>(`${this.baseurl}products/${id}`);
  }

  deleteProduct(productId: number) {
   return this._http.delete(`${this.baseurl}products/${productId}`);
  }

  getAllCategories(limit: number = 10): Observable<Category[]> {
    const params = new HttpParams()
    .set('limit', limit.toString());
    return this._http.get<Category[]>(`${this.baseurl}categories`, { params });
  }


  filterProductsByCategoryAndPrice(categoryId: number | null, minPrice: number = 0, maxPrice: number = 2000, offset: number ): Observable<Product[]> {
    let params = new HttpParams()
      .set('price_min', minPrice.toString())
      .set('price_max', maxPrice.toString())
      .set('limit', this.limit().toString())
      .set('offset', offset.toString());

    if (categoryId !== null) {
      params = params.set('categoryId', categoryId.toString());
    }
    return this._http.get<Product[]>(`${this.baseurl}products`, { params });
  }




  


  

  






}
