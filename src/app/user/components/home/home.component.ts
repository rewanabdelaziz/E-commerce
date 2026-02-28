import { Component } from '@angular/core';
import { HomeSliderComponent } from "../home-slider/home-slider.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
