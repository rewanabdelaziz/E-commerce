import { Injectable , computed, inject , signal} from '@angular/core';
import { UserProfile, UserRole } from '../../core/models/user';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CryptoService } from './crypto.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl
  private _http = inject(HttpClient)
  private _cryptoService = inject(CryptoService)
  private router = inject(Router)
  
  currentUser = signal<UserProfile | null>(null);
  userRole = signal<UserRole>('guest')
  isLoggedIn = computed(()=> !!this.currentUser())
  
  // app intit
  initAuth() {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.getCurrentUser();
    }
  }
  
  // signUp
  SignUp(user:UserProfile){
    return this._http.post(`${this.baseUrl}/users/`,user)
  }
  
  // check email existance
  async checkEmailExistence(email: string):Promise<boolean> {
    try {
      // convert observable to promise
      const res = await firstValueFrom(
      this._http.post<{ isAvailable: boolean }>(`${this.baseUrl}/users/is-available`, { email })
    );
    return res.isAvailable;
    } catch (error) {
      return false;
    }
  }

  
  // login
  login(email:string,password:string){
    return this._http.post(`${this.baseUrl}/auth/login`,{'email':email,'password':password})
  }
 
  // get current user
  getCurrentUser() {
    this._http.get<UserProfile>(`${this.baseUrl}/auth/profile`).subscribe({
      next: (res) => {
        this.currentUser.set(res);
        this.userRole.set(res.role!)
       
      }
    });
  }


  // refresh access token
  refreshAccessToken(){
    let refresh_token = localStorage.getItem('refresh_token')
    if(refresh_token){
      refresh_token = this._cryptoService.decrypt(refresh_token)
      this._http.post(`${this.baseUrl}/auth/refresh-token`,{'refreshToken': refresh_token}).subscribe({
        next: (res:any) => {
          const newToken = this._cryptoService.encrypt(res.access_token);
          localStorage.setItem('access_token',newToken)
        },
        error: ()=> this.logout()
      })
    }
    

  }


  //  logout
  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('access_token')
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/auth/login'])
  }

}
