import { TestBed } from '@angular/core/testing';

import { Infraction } from './infraction';

describe('Infraction', () => {
  let service: Infraction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Infraction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
