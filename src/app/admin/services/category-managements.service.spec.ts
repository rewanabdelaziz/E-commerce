import { TestBed } from '@angular/core/testing';

import { CategoryManagementsService } from './category-managements.service';

describe('CategoryManagementsService', () => {
  let service: CategoryManagementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryManagementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
