import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../core/models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryManagementsService {
  baseurl=environment.apiUrl
  _httpclient = inject(HttpClient)
  
  getCatById(id:number){
    return this._httpclient.get(`${this.baseurl}categories/${id}`)
  }

  addNewCategory(name:string,image:string){
    return this._httpclient.post(`${this.baseurl}categories/`,{name,image})
  }

  editCategory(cat: Category){
    return this._httpclient.put(`${this.baseurl}categories/`,cat)
  }

  deleteCategory(id:number){
    return this._httpclient.delete(`${this.baseurl}categories/${id}`)
  }
}
