import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-pageNotFound',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pageNotFound.component.html',
  styleUrls: ['./pageNotFound.component.css']
})
export class PageNotFoundComponent  {

  constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }

}
