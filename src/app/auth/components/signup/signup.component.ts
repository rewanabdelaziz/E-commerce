import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UserProfile } from '../../../core/models/user';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm:FormGroup
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private _auth:AuthService, private _route:Router){
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


  async onSignUp(){
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();  
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const newUser:UserProfile={
      userName:this.userName?.value.trim(),
      email:this.email?.value,
      password:this.password?.value,
    }

    try {
      await this._auth.addNewUser(newUser)
    } catch (error:any) {
      this.errorMessage.set(error)
    } finally{
      this.isLoading.set(false)
    }
    
    // console.log(newUser)
  }
}
