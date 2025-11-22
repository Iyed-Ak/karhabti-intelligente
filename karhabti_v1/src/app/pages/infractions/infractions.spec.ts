import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Infractions } from './infractions';

describe('Infractions', () => {
  let component: Infractions;
  let fixture: ComponentFixture<Infractions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Infractions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Infractions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
