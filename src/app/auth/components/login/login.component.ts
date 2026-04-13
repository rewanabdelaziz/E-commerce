import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CryptoService } from '../../service/crypto.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  msgError = signal<string | null>(null)
  isloading = signal<boolean>(false);
  logInForm:FormGroup
  private _auth= inject(AuthService)
  private _route= inject(Router)
  private _encryptService = inject(CryptoService)

  constructor(){
    this.logInForm=new FormGroup({
      email: new FormControl('',[Validators.required,Validators.email,Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
      password: new FormControl('',[Validators.required]),
    })
  }

  get email(){
    return this.logInForm.get('email')
  }

  get password(){
    return this.logInForm.get('password')
  }

  async onLogIn(){
    this.msgError.set(null)
    this.isloading.set(true)
    
    if(this.logInForm.valid){
      const {email,password} = this.logInForm.value
      
      const isEmailExist = await this.isEmailExist()
      // if true and email not registered
      if(!isEmailExist){
        this.isloading.set(true)
        return
      }

      this._auth.login(email,password).subscribe({
        next: async (res: any)=>{
          
          // console.log(res)
          let { access_token, refresh_token } = res;
          access_token = this._encryptService.encrypt(access_token);
          refresh_token = this._encryptService.encrypt(refresh_token);
  
          localStorage.setItem('access_token', access_token); 
          localStorage.setItem('refresh_token', refresh_token); 
          await this._auth.getCurrentUser()
          this._route.navigate(['/user', 'home'])
        },
        error: (err)=>{
          // console.log(err)
          if(err.status == 401 ){
            this.msgError.set('user not fount! sign up first.')
          }else{
          this.msgError.set(err.error.message || 'An error occurred during login. Please try again.')
          }
          this.isloading.set(true)
        }
      })
    } else {
      this.msgError.set('Please fill in all required fields with valid information.')
    }
   
  }

  async isEmailExist(): Promise<boolean>{
    const email = this.email?.value;
    if (email) {
      const isEmailExist: boolean = await this._auth.checkEmailExistence(email);
      // if return false means user already registered!
      if (isEmailExist) {
        this.msgError.set('This email is not registered. Please sign up first.');
        return false
      } else {
        this.msgError.set(null);
        return true
      }
      
    } else {
      this.msgError.set('Please enter an email to check.');
      return false
    }

  }


  fillDemoData() {
    this.logInForm.patchValue({
      email: 'admin@mail.com',
      password: 'admin123'
    });
    
  }
}
