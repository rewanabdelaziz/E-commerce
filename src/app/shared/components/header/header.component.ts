import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private _auth = inject(AuthService)
  role = this._auth.userRole
  islogged = this._auth.isLoggedIn

  logout(){
    this._auth.logout()
  }
}
