import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersManagementsService {

  baseurl=environment.apiUrl
  _httpclient = inject(HttpClient)
  
  getAllUsers(){
    return this._httpclient.get(`${this.baseurl}users/`)
  }
  getUserById(id:number){
    return this._httpclient.get(`${this.baseurl}users/${id}`)
  }
  deleteUser(id:number){
    return this._httpclient.delete(`${this.baseurl}users/${id}`)
  }
  editUser(id:number,email:string,name:string){
    return this._httpclient.put(`${this.baseurl}users/${id}`,{email,name})
  }
}
