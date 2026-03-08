import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { HomeSliderComponent } from '../home-slider/home-slider.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-userlayout',
  standalone: true,
  imports: [ RouterOutlet, HeaderComponent,FooterComponent],
  templateUrl: './userlayout.component.html',
  styleUrl: './userlayout.component.css'
})
export class UserlayoutComponent {

}
