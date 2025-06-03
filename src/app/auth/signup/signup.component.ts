import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { User } from '../../core/interfaces/user';
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

  constructor(private _auth:AuthService, private _route:Router){
    this.signupForm=new FormGroup({
      userName: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9]{3,20}$/)]),
      email: new FormControl('',[Validators.required,Validators.email,Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]),
      password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*\d).{8,}$/)]),
      role: new FormControl('user')
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
    const newUser:User={
      userName:this.userName?.value,
      email:this.email?.value,
      password:this.password?.value,
      role:'user'
    }
    this._auth.addNewUser(newUser).subscribe({
    next: () => {
      this._route.navigateByUrl('/auth/login')
      // console.log('User signed up successfully');
    },
    error: (err) => {
      console.error('Signup failed:', err);
    }
  });
    // console.log(newUser)
  }
}
