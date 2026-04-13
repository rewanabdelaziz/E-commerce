import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Category } from '../../core/models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryManagementsService {
  baseurl=environment.apiUrl
  categories = signal<Category[]>([])
  _httpclient = inject(HttpClient)

  constructor() { 
    this.getAllcats();
  }
  
  getCatById(id:number){
    return this._httpclient.get(`${this.baseurl}categories/${id}`)
  }

  getAllCategories(limit?:number,offset?:number){
    let params = new HttpParams()

    if(limit !== undefined) params = params.set('limit', limit?.toString() )
    if(offset !== undefined) params = params.set('offset', offset?.toString());

    return this._httpclient.get(`${this.baseurl}categories/`, { params })
  }

  addNewCategory(name:string,image:string){
    return this._httpclient.post(`${this.baseurl}categories/`,{name,image})
  }

  editCategory(cat: Category){
    return this._httpclient.put(`${this.baseurl}categories/${cat.id}`,cat)
  }

  deleteCategory(id:number){
    return this._httpclient.delete(`${this.baseurl}categories/${id}`)
  }

  getAllcats(){
    this.getAllCategories().subscribe({
      next: (res) =>{
        const newCats = res as Category[];
        this.categories.set(newCats);
      },
      error: (err) =>{
        console.log(err)
      }
    })
  }
}
