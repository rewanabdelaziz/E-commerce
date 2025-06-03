import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component";
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-adminlayout',
  standalone: true,
  imports: [RouterOutlet,AdminHeaderComponent, SpinnerComponent],
  templateUrl: './adminlayout.component.html',
  styleUrl: './adminlayout.component.css'
})
export class AdminlayoutComponent {

}
