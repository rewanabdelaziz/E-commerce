import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { AdminHeaderComponent } from '../admin-header/admin-header.component';
import { HeaderComponent } from "../../../shared/components/header/header.component";

@Component({
  selector: 'app-adminlayout',
  standalone: true,
  imports: [RouterOutlet,  SpinnerComponent, HeaderComponent],
  templateUrl: './adminlayout.component.html',
  styleUrl: './adminlayout.component.css'
})
export class AdminlayoutComponent {

}
