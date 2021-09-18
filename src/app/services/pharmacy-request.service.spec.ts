import { TestBed } from '@angular/core/testing';

import { PharmacyRequestService } from './pharmacy-request.service';

describe('PharmacyRequestService', () => {
  let service: PharmacyRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PharmacyRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
