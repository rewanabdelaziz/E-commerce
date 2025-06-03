import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../user/services/products.service';
import { IcartProduct } from '../../../core/interfaces/IcartProduct';

@Component({
  selector: 'app-admincart',
  standalone: true,
  imports: [DatePipe,ReactiveFormsModule],
  templateUrl: './admincart.component.html',
  styleUrl: './admincart.component.css'
})
export class AdmincartComponent implements OnInit{
  carts:any[] = [];
  dateForm!:FormGroup;
  total:number=0
  details :any;
  products: IcartProduct[]= [] as  IcartProduct[];

  constructor(private _cart:CartService,private _fb:FormBuilder, private _productService: ProductsService){
    this.dateForm= this._fb.group({
      start: ['',[Validators.required]],
      end: ['',[Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getAllCarts()
  }

  getAllCarts(){
    this._cart.getAllCarts().subscribe({
      next: (res:any) =>{
        this.carts=res
        // console.log(this.carts)
      },
      error: (err) => {
        console.log(err)
      }
  })
  }

  filter(){
    let date=this.dateForm.value;
    // console.log("date",date)
    this._cart.getAllCarts(date).subscribe({
      next: (res:any) =>{
        this.carts=res
        // console.log(this.carts)
      },
      error: (err) => {
        console.log(err)
      }
  })
  }

  delete(id:number){
    this._cart.deleteCart(id).subscribe({
      next:(res)=>{
        // this.getAllCarts()
        let exsit = this.carts.find((item)=> item.id === id)
        if (exsit){
          let index = this.carts.findIndex((item)=> item.id === id)
          this.carts.splice(index,1)
          // console.log(this.carts)
        }
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  viewDetails(id:number){
    let itemIndex = this.carts.findIndex((item)=> item.id === id)
    this.details = this.carts[itemIndex]
    // console.log(this.details)
    this.products=[]
    for(let x in this.details.products){
      this._productService.getProductsById(this.details.products[x].productId).subscribe({
        next: (prd)=> {
          this.products.push({item: prd, quantity:this.details.products[x].quantity})
          // console.log(this.products)
          this.getTotalPrice()
        },
        error: (err)=>{
          console.log(err)
        }
      })
    }
  }

  getTotalPrice(){
    this.total=0
    for (let prd in this.products){
      this.total += this.products[prd].item.price * this.products[prd].quantity
    }
  }

}
