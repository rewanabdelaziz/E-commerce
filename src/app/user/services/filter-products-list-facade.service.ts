import { inject, Injectable, signal, effect } from '@angular/core';
import { ProductsService } from './products.service';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product';
import { ActivatedRoute } from '@angular/router';
import { UserCartService } from './userCart.service';
import { AuthService } from '../../auth/service/auth.service';
import { CategoryManagementsService } from '../../admin/services/category-managements.service';
import { Category } from '../../core/models/category';
import { Options } from '@angular-slider/ngx-slider';
import { ProductListPaginationService } from './product-list-pagination.service';
@Injectable({
  providedIn: 'root'
})
export class FilterProductsListFacadeService {
  private readonly _products = inject(ProductsService);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute); 
  private readonly _cartService = inject(UserCartService);
  private readonly _auth = inject(AuthService);
  private readonly _categoryService = inject(CategoryManagementsService);
  private readonly _productListPaginationService = inject(ProductListPaginationService);

  Products = signal<Product[]>([]);
  cart: { item: Product, quantity: number }[] = []
  Allcategories: Category[] = [];
  selectedCategoryId = signal<number | null>(null);
  isfiltered = signal<boolean>(false)
  

  minValue = signal(0);
  maxValue = signal(2000);
  options: Options = {
    floor: 0,
    ceil: 2000,
    step: 10,
    hideLimitLabels: true,
    hidePointerLabels: false

  };

  constructor() { 
    effect(() => {
      this.Allcategories = this._categoryService.categories().slice(0, 6);
    });
  }

  clearFilters() {
    this.isfiltered.set(false)
    this.selectedCategoryId.set(null);
    this.minValue.set(0);
    this.maxValue.set(2000);
    this._productListPaginationService.resetPagination();
    this.Products.set([]);
    this.fetchData();
  }

  getProductbycat(id: number) {
    this.isfiltered.set(true)
    this.selectedCategoryId.set(id);
    this._productListPaginationService.resetPagination();
    this.Products.set([]);
    this.fetchData();
  }

  filterByPrice() {
    this._productListPaginationService.resetPagination();
    this.Products.set([]);
    this.fetchData();
  }
  
  loadMore() {
    this._productListPaginationService.calculateNextOffset()
    this.fetchData();
  }

  fetchData() {
    const currentOffset = this._productListPaginationService.offset();
    const min = this.minValue();
    const max = this.maxValue();
    const catId = this.selectedCategoryId();

    this._products.filterProductsByCategoryAndPrice(catId, min, max, currentOffset).subscribe({
      next: (res) => {
        this.Products.update(prd => [...prd, ...res])
        if (res.length === 0 || res.length < this._products.limit()) {
          this._productListPaginationService.isMoreData.set(false);
        }
      },
      error: (err) => this._router.navigate(['**'])
    });
  }

}
