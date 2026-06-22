import { TestBed } from '@angular/core/testing';

import { FilterProductsListFacadeService } from './filter-products-list-facade.service';

describe('FilterProductsListFacadeService', () => {
  let service: FilterProductsListFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterProductsListFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
