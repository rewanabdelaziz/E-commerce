import { SpinnerService } from './../../services/spinner.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [NgIf,AsyncPipe],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  isLoading$
  constructor(private _spinner:SpinnerService){
    this.isLoading$ = this._spinner.loading$;
  }

}
