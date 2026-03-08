import { Routes } from '@angular/router';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { UserlayoutComponent } from './components/userlayout/userlayout.component';
import { CartComponent } from './components/cart/cart.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';

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
      { path: 'cart', component: CartComponent },
      { path: 'about', component: AboutComponent }

    ]
  }
];
