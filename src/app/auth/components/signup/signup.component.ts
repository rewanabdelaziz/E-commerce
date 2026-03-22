import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UserProfile } from '../../../core/models/user';
import { Router, RouterLink } from '@angular/router';
import { CryptoService } from '../../service/crypto.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private _auth = inject(AuthService)
  private _route = inject(Router)
  private _encryptService = inject(CryptoService)
  signupForm:FormGroup
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(){
    this.signupForm=new FormGroup({
      userName: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9 ]{3,20}$/)]),
      email: new FormControl('',[Validators.required,Validators.email,Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
      password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/)]),
    })
  }

  get email(){
    return this.signupForm.get('email')
  }

  get userName(){
    return this.signupForm.get('userName')
  }

  get password(){
    return this.signupForm.get('password')
  }
  
  onSignUp(){
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();  
      return;
    }
    this.errorMessage.set(null)
    this.isEmailExist()
    const newUser:UserProfile={
      name:this.userName?.value.trim(),
      email:this.email?.value,  
      password:this.password?.value,
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(this.userName?.value.trim())}&background=6C63FF&color=0f172a`
    }
    this._auth.SignUp(newUser).subscribe({
      next: (res :any)=>{
        // console.log(res)
        this._route.navigateByUrl('/auth/login')
      },
      error: (err)=>{ 
        this.errorMessage.set(err.error.message || 'An error occurred during sign up. Please try again.')
      }
    })
  }

 async isEmailExist(){
    const email = this.email?.value;  
    if (email) {
      const isEmailExist: boolean = await this._auth.checkEmailExistence(email);
      if (!isEmailExist) {
        this.errorMessage.set('This email is already registered. Please log in instead.');
      } else {
        this.errorMessage.set(null);
       }
      } else {
        this.errorMessage.set('Please enter an email.');
      }
  }

}
