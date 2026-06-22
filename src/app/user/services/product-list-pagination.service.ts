import { inject, Injectable, signal } from '@angular/core';
import { FilterProductsListFacadeService } from './filter-products-list-facade.service';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class ProductListPaginationService {
  private readonly _products = inject(ProductsService);

  offset = signal<number>(0);
  isMoreData = signal<boolean>(true); 

  constructor() { }

  resetPagination() {
    this.offset.set(0);
    this.isMoreData.set(true);
  }

  calculateNextOffset(): number {
    this.offset.update(value => value + this._products.limit());
    return this.offset();
  }
}
