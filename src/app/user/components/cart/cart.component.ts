import { IcartProduct } from '../../../core/models/IcartProduct';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IcartModel } from '../../../core/models/IcartModel';
import { UserCartService } from '../../services/userCart.service';
import { DecimalPipe, NgIf } from '@angular/common';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule,NgIf,DecimalPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartProducts:IcartProduct[]=[] as IcartProduct[];
  total:number=0;
  currentIndex:number=0;
  success:boolean=false;
  currentItem:IcartProduct={} as IcartProduct;

  constructor(private _cartService:UserCartService,private _auth:AuthService){}
  ngOnInit(): void {
    this.getCartProducts();
  }

  getCartProducts(){
    if(localStorage.getItem('cart')){
        this.cartProducts=JSON.parse(localStorage.getItem('cart')!)
    }
    this.getTotalPrice();
  }

  getTotalPrice(){
    this.total=0
    for (let prd in this.cartProducts){
      this.total += this.cartProducts[prd].item.price * this.cartProducts[prd].quantity
    }
  }

  getProductbyId(id:number){
    this.currentItem=this.cartProducts.find((prd:IcartProduct)=> prd.item.id === id)!
    this.currentIndex=this.cartProducts.indexOf(this.currentItem)
  }

  setToLocalStorage(){
    localStorage.setItem('cart',JSON.stringify(this.cartProducts))
  }
  minusQauntity(id:number){
    this.getProductbyId(id)
    this.cartProducts[this.currentIndex].quantity -= 1
    this.setToLocalStorage()
    this.getTotalPrice()
    // console.log(this.currentItem);
  }

  plusQauntity(id:number){
    this.getProductbyId(id)
    this.cartProducts[this.currentIndex].quantity += 1
    this.setToLocalStorage()
    this.getTotalPrice()
  }

  clearCart(){
    this.cartProducts=[]
    localStorage.removeItem('cart')
    this.getTotalPrice()
  }

  detectQuantityChange(){
    this.setToLocalStorage()
    this.getTotalPrice()
  }

  deleteProduct(id:number){
    this.getProductbyId(id)
    this.cartProducts.splice(this.currentIndex,1)
    this.setToLocalStorage()
    this.getTotalPrice()
  }

  addCart(){
    let user = this._auth.currentUser()
    let mapProducts=this.cartProducts.map((prd)=>{
      return {productId:prd.item.id, quantity: prd.quantity}
    })
    let model:IcartModel ={
      userId: (user?.id)? user?.id : 1,
      date: new Date(),
      products: mapProducts
    }
    this._cartService.createNewCart(model).subscribe({
      next: ()=> {
        this.success=true
        this.clearCart()
      },
      error: (err)=> {
        console.log(err)
      }
    })
    // console.log(model)
  }
}
