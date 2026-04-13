import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrdersService } from '../../../shared/services/orders.service';
import { CommonModule, DatePipe, DecimalPipe, UpperCasePipe } from '@angular/common';
import { Router } from "@angular/router";

@Component({
  selector: 'app-user-orders',
  standalone: true,
  imports: [DecimalPipe, DatePipe, UpperCasePipe, CommonModule],
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent {
 toastr = inject(ToastrService);
  _ordersService = inject(OrdersService);
 private _router = inject(Router);
 userOrders = this._ordersService.userOrders;

 gotohome(){
  this._router.navigate(['/home'])
 }

 cancelOrder(id:string){
  this._ordersService.deleteOrder(id).then(() => {
    this.toastr.success('Order cancelled successfully');
  }).catch(error => {
    console.error('Error cancelling order:', error);
    this.toastr.error('Failed to cancel order');
  });

  
 }



}
