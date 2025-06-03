import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
@Input() SelectTitle:string ='';
@Input() SelectValue:string ='';
@Input() Allcategories=[];
@Input() All:boolean=true;

@Output() onChangeSelect:EventEmitter<string>
  constructor(){
    this.onChangeSelect=new EventEmitter<string>
  }
  changeSelect(event:any){
    this.onChangeSelect.emit(event)
  }
}
