import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { IcartProduct } from '../../../core/models/IcartProduct';
import { UserCartService } from '../../../user/services/userCart.service';
import { DecimalPipe } from '@angular/common';
import { Order } from '../../../core/models/order';
import { OrdersService } from '../../services/orders.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,DecimalPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private _auth = inject(AuthService)
  private _ordersService = inject(OrdersService)
  toastr = inject(ToastrService);
  
  user = this._auth.currentUser 
  role = this._auth.userRole
  islogged = this._auth.isLoggedIn

  cartProducts = computed(() => this._cartService.cart())
  total:number=0;
  currentIndex:number=0;
  success:boolean=false;
  currentItem:IcartProduct={} as IcartProduct;
  private _cartService = inject(UserCartService)

  logout(){
    this._auth.logout()
  }

  ngOnInit(): void {
    this.getTotalPrice();
  }


  getTotalPrice(){
    this.total=0
    for (let prd in this.cartProducts()){
      this.total += this.cartProducts()[prd].item.price * this.cartProducts()[prd].quantity
    }
  }

  getProductbyId(id:number){
    this.currentItem=this.cartProducts().find((prd:IcartProduct)=> prd.item.id === id)!
    this.currentIndex=this.cartProducts().indexOf(this.currentItem)
  }

  setToLocalStorage(){
    localStorage.setItem('cart',JSON.stringify(this.cartProducts()))
  }

  minusQauntity(id:number){
    this.getProductbyId(id)
    this.cartProducts()[this.currentIndex].quantity -= 1
    this.setToLocalStorage()
    this.getTotalPrice()
    // console.log(this.currentItem);
  }

  plusQauntity(id:number){
    this.getProductbyId(id)
    this.cartProducts()[this.currentIndex].quantity += 1
    this.setToLocalStorage()
    this.getTotalPrice()
  }

  clearCart(){
    this._cartService.cart.set([])
    localStorage.removeItem('cart')
    this.getTotalPrice()
  }

  detectQuantityChange(){
    this.setToLocalStorage()
    this.getTotalPrice()
  }

  deleteProduct(id:number){
    this.getProductbyId(id)
    this._cartService.cart.update((cartProducts) => {
      cartProducts.splice(this.currentIndex,1)
      return cartProducts
    })
    this.setToLocalStorage()
    this.getTotalPrice()
  }

  async checkout(){
    let user = this._auth.currentUser()
    if(user){
      let orderData:Order = {
        customerName: user.name,
        email: user.email,
        userId: user.id!,
        items: this.cartProducts(),
        totalPrice: this.total,
        status: 'pending'

      }
      this.toastr.info('Processing your order...', 'Checkout');
      try {
        const orderId = await this._ordersService.newOrder(orderData);
        this.toastr.success('Your order has been placed successfully!', 'Success');
        console.log('Order placed successfully with ID:', orderId);

        this.clearCart(); 
      } catch (error) {
        this.toastr.error('There was an error placing your order. Please try again.', 'Error');
        console.error('Error placing order:', error);
      }
    }else{
      this.toastr.warning('Please log in to proceed with checkout.', 'Not Logged In');
    }


}
    
  // addCart(){
  //     let user = this._auth.currentUser()
  //     let mapProducts=this.cartProducts().map((prd)=>{
  //       return {productId:prd.item.id, quantity: prd.quantity}
  //     })
  //     let model:IcartModel ={
  //       userId: (user?.id)? user?.id : 1,
  //       date: new Date(),
  //       products: mapProducts
  //     }
  //     this._cartService.createNewCart(model).subscribe({
  //       next: ()=> {
  //         this.success=true
  //         this.clearCart()
  //       },
  //       error: (err)=> {
  //         console.log(err)
  //       }
  //     })
  //     // console.log(model)
  // }



}
