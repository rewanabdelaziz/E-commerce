import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { HeaderComponent } from "../../../shared/components/header/header.component";


@Component({
  selector: 'app-authlayout',
  standalone: true,
  imports: [RouterOutlet, SpinnerComponent, HeaderComponent],
  templateUrl: './authlayout.component.html',
  styleUrls: ['./authlayout.component.css']
})
export class AuthlayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
