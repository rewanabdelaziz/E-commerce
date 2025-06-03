import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from "../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-authlayout',
  standalone: true,
  imports: [RouterOutlet, SpinnerComponent],
  templateUrl: './authlayout.component.html',
  styleUrls: ['./authlayout.component.css']
})
export class AuthlayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
