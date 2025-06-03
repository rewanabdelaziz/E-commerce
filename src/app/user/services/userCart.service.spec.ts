/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserCartService } from './userCart.service';

describe('Service: UserCart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserCartService]
    });
  });

  it('should ...', inject([UserCartService], (service: UserCartService) => {
    expect(service).toBeTruthy();
  }));
});
