import { Routes } from '@angular/router';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { UserlayoutComponent } from './components/userlayout/userlayout.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';

export const userRoutes: Routes = [
  {
    path: '',
    component: UserlayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {path: 'home', component: HomeComponent},
      { path: 'products', component: AllProductsComponent },
      { path: 'products/:id', component: AllProductsComponent },
      { path: 'details/:id', component: ProductDetailsComponent },
      { path: 'orders', component: UserOrdersComponent },
      { path: 'about', component: AboutComponent }

    ]
  }
];
