import { Component } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
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
