import { TestBed } from '@angular/core/testing';

import { UsersManagementsService } from './users-managements.service';

describe('UsersManagementsService', () => {
  let service: UsersManagementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersManagementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
