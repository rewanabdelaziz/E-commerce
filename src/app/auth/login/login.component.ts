import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  msgError:string=''
  logInForm:FormGroup
  constructor(private _auth:AuthService, private _route:Router){
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

  onLogIn(){
    this._auth.getUser(this.email?.value,this.password?.value).subscribe({
        next: (user) => {
          const User = user
          if(!User){
            this.msgError = "email or password is incorrect, try again"
            // console.log(this.msgError)
            return;
          }else if(User.role === 'user'){
            this._auth.storeUser(User);
            this._route.navigateByUrl('/user')
          }else{
            this._auth.storeUser(User);
            this._route.navigateByUrl('/admin')
          }
          this.msgError='';
          // console.log(User)
        },
        error: (err) => {
          this.msgError = "email or password is incorrect, try again"
          // console.log(this.msgError)
        }
      });

  }
}
