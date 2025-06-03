import { routes } from './../../../app.routes';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Iproduct } from '../../../core/interfaces/iproduct';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  currentId!:number;
  product:Iproduct= {} as Iproduct;

  constructor(private _products:ProductsService,private _router:Router,private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap)=>{
      this.currentId=Number(paramMap.get('id'))
      this.getProductbyid(this.currentId)
    })
  }


  getProductbyid(id:number){
  this._products.getProductsById(id).subscribe({
    next: (res) =>{
      this.product=res
    // console.log('filtered',this.Products)
    },
    error: (err) =>{
      console.log(err)
      this._router.navigate(['**'])
    }
  })
  }
}
