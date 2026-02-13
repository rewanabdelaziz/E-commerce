import { HttpClient } from '@angular/common/http';
import { Injectable , inject , signal} from '@angular/core';
import { UserProfile } from '../../core/models/user';
import { map, Observable } from 'rxjs';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: UserProfile | null = null;

  constructor(private _http:HttpClient) {}

  addNewUser(user:UserProfile){
    return this._http.post('http://localhost:3000/users',user)
  }

  getUser(email:string,password:string):Observable<UserProfile | undefined>{
    return this._http.get<UserProfile[]>(`http://localhost:3000/users?email=${email}&password=${password}`).pipe(map(users => users[0]));
  }

  storeUser(user: UserProfile) {
    this.currentUser = user;
    const encodedUser = btoa(JSON.stringify(user)); // encode with Base64
    localStorage.setItem('user', encodedUser);
  }

  getCurrentUser(): UserProfile | null {
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
