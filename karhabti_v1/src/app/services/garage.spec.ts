import { TestBed } from '@angular/core/testing';

import { Garage } from './garage';

describe('Garage', () => {
  let service: Garage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Garage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
