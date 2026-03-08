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



  getAllProducts(offset: number=0):Observable<Product[]>{
    const params = new HttpParams()
    .set('limit', this.limit().toString())
    .set('offset', offset.toString());
    return this._http.get<Product[]>(`${this.baseurl}/products`, { params });

  }

  getLimitedProducts(count: number = 5, offset: number = 15): Observable<Product[]> {
    const params = new HttpParams()
    .set('limit', count.toString())
    .set('offset', offset.toString());
    return this._http.get<Product[]>(`${this.baseurl}/products`, { params });
  }

  getProductbycatId(categoryId: number, offset: number = 0): Observable<Product[]> {
    const params = new HttpParams()
    .set('categoryId', categoryId.toString())
    .set('limit', this.limit().toString())
    .set('offset', offset.toString());
    return this._http.get<Product[]>(`${this.baseurl}/products`, { params });
  }

  getProductsById(id: number): Observable<Product> {
   return this._http.get<Product>(`${this.baseurl}/products/${id}`);
  }

  deleteProduct(productId: number) {
   return this._http.delete(`${this.baseurl}/products/${productId}`);
  }

  getAllCategories(limit: number = 10): Observable<Category[]> {
    const params = new HttpParams()
    .set('limit', limit.toString());
    return this._http.get<Category[]>(`${this.baseurl}/categories`, { params });
  }









  // async addProduct(product: Iproduct) {
  //   const newDocRef = doc(this.productsCollection); // auto-generated ID
  //   return await setDoc(newDocRef, { ...product, id: newDocRef.id });
  // }





  


  

  






}
