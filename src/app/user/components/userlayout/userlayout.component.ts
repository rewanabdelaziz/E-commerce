import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { HeaderComponent } from "../../../shared/components/header/header.component";

@Component({
  selector: 'app-userlayout',
  standalone: true,
  imports: [ RouterOutlet, SpinnerComponent, HeaderComponent],
  templateUrl: './userlayout.component.html',
  styleUrl: './userlayout.component.css'
})
export class UserlayoutComponent {

}
