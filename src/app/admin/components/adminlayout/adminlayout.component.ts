import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-adminlayout',
  standalone: true,
  imports: [RouterOutlet,  SpinnerComponent,RouterLink,RouterLinkActive],
  templateUrl: './adminlayout.component.html',
  styleUrl: './adminlayout.component.css'
})
export class AdminlayoutComponent {
  isSidebarOpen = false;
  _auth = inject(AuthService)
  

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
