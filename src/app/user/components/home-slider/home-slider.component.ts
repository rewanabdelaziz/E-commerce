import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/product';
import { Category } from '../../../core/models/category';
import { ImageFallbackDirective } from '../../../shared/directive/image-fallback.directive';


@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [ImageFallbackDirective],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css'
})
export class HomeSliderComponent  {
  productsService = inject(ProductsService);
  private _router = inject(Router);
  Allcategories =signal<Category[]>(this.productsService.categories());
  products = signal<Product[]>(this.productsService.products()); 
 
  showDetails(id: number) {
    this._router.navigate(['/user/details', id]);
  }

  showCategoryProducts(id: number) {
    this._router.navigate(['/user/products', id]);
  }

}
