import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../shared/services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Status } from '../../../core/models/order';
 import Swal from 'sweetalert2'; 
@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.css'
})
export class OrdersManagementComponent {
  private _ordersService = inject(OrdersService);
  private toastr = inject(ToastrService);

  orders = this._ordersService.allOrders;
  filterStatus = signal<string>('all');
  isLoading = this._ordersService.isLoading;
  statuses: Status[] = ['pending', 'shipped', 'delivered'];

  filteredOrders = computed(() => {
    const status = this.filterStatus();
    const allOrders = this.orders();
    
    if (status === 'all') return allOrders;
    return allOrders.filter(o => o.status === status);
  });

  ngOnInit() {
    this.loadAllOrders();
  }

  async loadAllOrders() {
    this.isLoading.set(true);
    try {
      const data = await this._ordersService.getOrders();
      this.orders.set(data); 
    } catch (error) {
      this.toastr.error('Failed to load orders');
    } finally {
      this.isLoading.set(false);
    }
  }

  setFilter(status: string) {
    this.filterStatus.set(status);
  }


  async deleteOrder(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a855f7', 
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b', 
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this._ordersService.deleteOrder(id);
          this.orders.update(all => all.filter(o => o.id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'Order has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#1e293b',
            color: '#fff'
          });
        } catch (error) {
          this.toastr.error('Delete failed');
        }
      }
    });
  }

 async changeStatus(orderId: string, newStatus: any) {
  try {
    await this._ordersService.updateOrder(orderId, { status: newStatus });
    
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#1e293b',
      color: '#fff'
    });

    Toast.fire({
      icon: 'success',
      title: `Status updated to ${newStatus}`
    });

    this.orders.update(all => all.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  } catch (error) {
    this.toastr.error('Update failed');
  }
}
}
