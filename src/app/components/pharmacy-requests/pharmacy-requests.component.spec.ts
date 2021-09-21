import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyRequestsComponent } from './pharmacy-requests.component';

describe('PharmacyRequestsComponent', () => {
  let component: PharmacyRequestsComponent;
  let fixture: ComponentFixture<PharmacyRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
