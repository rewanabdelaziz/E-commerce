import { Component, computed, inject } from '@angular/core';
import { OrdersService } from '../../../shared/services/orders.service';
import { CommonModule, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Router } from "@angular/router";
import Swal from 'sweetalert2'; 
import { Order } from '../../../core/models/order';

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [DecimalPipe, DatePipe, UpperCasePipe, CommonModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent {
  _ordersService = inject(OrdersService);
  private _router = inject(Router);
  userOrders  = computed(() => this._ordersService.userOrders());
  selectedOrder: Order | null = null;
  
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#fff'
  });

  gotohome() {
    this._router.navigate(['/user/home']);
  }

  cancelOrder(id: string) {
    Swal.fire({
      title: 'Cancel Order?',
      text: "Are you sure you want to cancel this order? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, cancel it!',
      background: '#1e293b',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this._ordersService.deleteOrder(id).then(() => {
          this.Toast.fire({
            icon: 'success',
            title: 'Order cancelled successfully'
          });
          this._ordersService.userOrders.update(orders => orders.filter(order => order.id !== id));
        }).catch(error => {
          console.error('Error cancelling order:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to cancel order',
            background: '#1e293b',
            color: '#fff'
          });
        });
      }
    });
  }

  openOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  // printInvoice() {
  //   window.print(); 
  // }
}