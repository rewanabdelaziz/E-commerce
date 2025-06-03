import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { UserHeaderComponent } from '../user-header/user-header.component';

@Component({
  selector: 'app-userlayout',
  standalone: true,
  imports: [UserHeaderComponent,RouterOutlet,SpinnerComponent],
  templateUrl: './userlayout.component.html',
  styleUrl: './userlayout.component.css'
})
export class UserlayoutComponent {

}
