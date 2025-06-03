import { Routes } from '@angular/router';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { UserlayoutComponent } from './components/userlayout/userlayout.component';
import { CartComponent } from './components/cart/cart.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserlayoutComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: AllProductsComponent },
      { path: 'details/:id', component: ProductDetailsComponent },
      { path: 'cart', component: CartComponent }

    ]
  }
];
