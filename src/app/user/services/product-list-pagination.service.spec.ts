import { TestBed } from '@angular/core/testing';

import { ProductListPaginationService } from './product-list-pagination.service';

describe('ProductListPaginationService', () => {
  let service: ProductListPaginationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductListPaginationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
