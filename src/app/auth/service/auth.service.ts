import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../core/interfaces/user';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private _http:HttpClient) {}

  addNewUser(user:User){
    return this._http.post('http://localhost:3000/users',user)
  }

  getUser(email:string,password:string):Observable<User | undefined>{
    return this._http.get<User[]>(`http://localhost:3000/users?email=${email}&password=${password}`).pipe(map(users => users[0]));
  }

  storeUser(user: User) {
    this.currentUser = user;
    const encodedUser = btoa(JSON.stringify(user)); // encode with Base64
    localStorage.setItem('user', encodedUser);
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    const encodedUser = localStorage.getItem('user');
    if (encodedUser) {
      try {
        this.currentUser = JSON.parse(atob(encodedUser));
        return this.currentUser;
      } catch {
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

}
