import { Routes } from '@angular/router';
import { AdminlayoutComponent } from './components/adminlayout/adminlayout.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { CategoryManagementsComponent } from './components/category-managements/category-managements.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { OrdersManagementComponent } from './components/orders-management/orders-management.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminlayoutComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'categories',component:CategoryManagementsComponent, pathMatch: 'full' },
      {path:'products',component:AdminProductsComponent,pathMatch:'full'},
      {path:'ordersManagement',component:OrdersManagementComponent,pathMatch:'full'},
      {path:'dashboard',component:AdminDashboardComponent,pathMatch:'full'},

    ]
  }
];
