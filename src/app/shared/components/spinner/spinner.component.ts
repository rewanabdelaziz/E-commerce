import { SpinnerService } from './../../services/spinner.service';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {
  loadingService = inject(SpinnerService)
}
