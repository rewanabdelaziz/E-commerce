import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from "../../../shared/components/header/header.component";



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  msgError = signal<string | null>(null)
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

  async onLogIn(){
    this.msgError.set(null);
    try {
        await this._auth.SignIn(this.email?.value,this.password?.value)
    } catch (error: any) {
      // console.log(error)
      this.msgError.set(error)
    }
  }


}
