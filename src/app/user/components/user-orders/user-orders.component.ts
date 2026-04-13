import { Component, inject } from '@angular/core';
import { OrdersService } from '../../../shared/services/orders.service';
import { CommonModule, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Router } from "@angular/router";
import Swal from 'sweetalert2'; // استيراد SweetAlert2

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
  userOrders = this._ordersService.userOrders;

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
    this._router.navigate(['/home'])
  }

  cancelOrder(id: string) {
    Swal.fire({
      title: 'Cancel Order?',
      text: "Are you sure you want to cancel this order? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', // لون أحمر للتنبيه
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
}