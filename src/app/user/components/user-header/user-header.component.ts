import { Component } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css'
})
export class UserHeaderComponent {
  constructor(private _auth:AuthService, private _route:Router){}
  islogged:boolean=false;
  ngOnInit(): void {
    this.islogged=this._auth.isLoggedIn()
  }

  logOut(){
    this._auth.logout();
    this._route.navigateByUrl('/auth/login')
  }
}
