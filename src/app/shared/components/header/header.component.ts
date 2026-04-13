import { Component, computed, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { IcartProduct } from '../../../core/models/IcartProduct';
import { UserCartService } from '../../../user/services/userCart.service';
import { DecimalPipe } from '@angular/common';
import { Order } from '../../../core/models/order';
import { OrdersService } from '../../services/orders.service';
import Swal from 'sweetalert2'; // استبدال Toastr بـ SweetAlert2

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, DecimalPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private _auth = inject(AuthService)
  private _ordersService = inject(OrdersService)
  private _cartService = inject(UserCartService)

  user = this._auth.currentUser
  role = this._auth.userRole
  islogged = this._auth.isLoggedIn

  cartProducts = computed(() => this._cartService.cart())
  total: number = 0;
  currentIndex: number = 0;
  success: boolean = false;
  currentItem: IcartProduct = {} as IcartProduct;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#fff'
  });

  logout() {
    this._auth.logout()
  }

  ngOnInit(): void {
    this.getTotalPrice();
  }

  getTotalPrice() {
    this.total = 0
    for (let prd in this.cartProducts()) {
      this.total += this.cartProducts()[prd].item.price * this.cartProducts()[prd].quantity
    }
  }

  getProductbyId(id: number) {
    this.currentItem = this.cartProducts().find((prd: IcartProduct) => prd.item.id === id)!
    this.currentIndex = this.cartProducts().indexOf(this.currentItem)
  }

  setToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartProducts()))
  }

  minusQauntity(id: number) {
    this.getProductbyId(id)
    if (this.cartProducts()[this.currentIndex].quantity > 1) {
      this.cartProducts()[this.currentIndex].quantity -= 1
      this.setToLocalStorage()
      this.getTotalPrice()
    } else {
      this.deleteProduct(id); // لو الكمية هتبقى صفر، امسح المنتج أحسن
    }
  }

  plusQauntity(id: number) {
    this.getProductbyId(id)
    this.cartProducts()[this.currentIndex].quantity += 1
    this.setToLocalStorage()
    this.getTotalPrice()
  }

  clearCart() {
    Swal.fire({
      title: 'Empty Cart?',
      text: "Are you sure you want to remove all items from your cart?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#a855f7',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, clear it!',
      background: '#1e293b',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this._cartService.cart.set([])
        localStorage.removeItem('cart')
        this.getTotalPrice()
        this.Toast.fire({ icon: 'success', title: 'Cart cleared' });
      }
    });
  }

  detectQuantityChange() {
    this.setToLocalStorage()
    this.getTotalPrice()
  }

  deleteProduct(id: number) {
    this.getProductbyId(id)
    this._cartService.cart.update((cartProducts) => {
      cartProducts.splice(this.currentIndex, 1)
      return [...cartProducts]; // Spread لضمان تحديث الـ Signal
    })
    this.setToLocalStorage()
    this.getTotalPrice()
    this.Toast.fire({ icon: 'info', title: 'Product removed' });
  }

  async checkout() {
    let user = this._auth.currentUser()
    if (user) {
      if (this.cartProducts().length === 0) {
        this.Toast.fire({ icon: 'warning', title: 'Your cart is empty' });
        return;
      }

      let orderData: Order = {
        customerName: user.name,
        email: user.email,
        userId: user.id!,
        items: this.cartProducts(),
        totalPrice: this.total,
        status: 'pending'
      }

      // إظهار حالة التحميل
      Swal.fire({
        title: 'Processing Order',
        html: 'Please wait while we place your order...',
        allowOutsideClick: false,
        background: '#1e293b',
        color: '#fff',
        didOpen: () => {
          Swal.showLoading()
        }
      });

      try {
        const orderId = await this._ordersService.newOrder(orderData);
        Swal.close();
        
        Swal.fire({
          icon: 'success',
          title: 'Order Placed!',
          text: 'Your order has been placed successfully.',
          timer: 3000,
          showConfirmButton: false,
          background: '#1e293b',
          color: '#fff'
        });

        // تنظيف العربة بدون سؤال تأكيد هنا لأن الطلب تم فعلاً
        this._cartService.cart.set([])
        localStorage.removeItem('cart')
        this.getTotalPrice()

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Checkout Failed',
          text: 'There was an error placing your order. Please try again.',
          background: '#1e293b',
          color: '#fff'
        });
        console.error('Error placing order:', error);
      }
    } else {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please log in to proceed'
      });
    }
  }
}