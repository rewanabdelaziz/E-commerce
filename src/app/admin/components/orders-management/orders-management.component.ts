import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../shared/services/orders.service';
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
export class OrdersManagementComponent implements OnInit {
  private _ordersService = inject(OrdersService);

  orders = this._ordersService.allOrders;
  filterStatus = signal<string>('all');
  isLoading = this._ordersService.isLoading;
  statuses: Status[] = ['pending', 'shipped', 'delivered'];

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#fff'
  });

  filteredOrders = computed(() => {
    const status = this.filterStatus();
    const allOrders = this.orders();
    
    if (status === 'all') return allOrders;
    return allOrders.filter(o => o.status === status);
  });

  ngOnInit() {
    // this.loadAllOrders();
  }

  async loadAllOrders() {
    this.isLoading.set(true);
    try {
      const data = await this._ordersService.getOrders();
      this.orders.set(data); 
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load orders',
        background: '#1e293b',
        color: '#fff'
      });
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
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b', 
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this._ordersService.deleteOrder(id);
          this.orders.update(all => all.filter(o => o.id !== id));
          this.Toast.fire({
            icon: 'success',
            title: 'Order deleted successfully'
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Delete failed',
            text: 'Something went wrong while deleting the order.',
            background: '#1e293b',
            color: '#fff'
          });
        }
      }
    });
  }

  async changeStatus(orderId: string, newStatus: any) {
    try {
      await this._ordersService.updateOrder(orderId, { status: newStatus });
      
      this.Toast.fire({
        icon: 'success',
        title: `Status updated to ${newStatus}`
      });

      this.orders.update(all => all.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: 'Could not update order status.',
        background: '#1e293b',
        color: '#fff'
      });
    }
  }
}