import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AdminlayoutComponent } from './components/adminlayout/adminlayout.component';
import { AdmincartComponent } from './components/admincart/admincart.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminlayoutComponent,
    children: [
      { path: '', redirectTo: 'cart', pathMatch: 'full' },
      { path: 'cart',component:AdmincartComponent, pathMatch: 'full' },
      {path:'products',component:AdminProductsComponent,pathMatch:'full'}
    ]
  }
];
