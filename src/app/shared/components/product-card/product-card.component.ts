import { NgIf, SlicePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Iproduct } from '../../../core/models/iproduct';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [SlicePipe,NgIf,FormsModule,RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
@Input() product:Iproduct={} as Iproduct
@Output() onAdd:EventEmitter<any>


isExpanded: { [key: number]: boolean } = {};
AddButton=false;
numOfProduct=0;

  constructor(){
    this.onAdd = new EventEmitter<any>
  }

  toggleReadMore(id: number, event: Event) {
    event.preventDefault();
    this.isExpanded[id] = !this.isExpanded[id];
  }

  add(num:number){
    this.onAdd.emit({item:this.product,quantity:num})
  }

  toggleAddButton(){
    this.AddButton=!this.AddButton
  }
}
