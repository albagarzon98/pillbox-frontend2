import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePharmacistComponent } from './home-pharmacist.component';

describe('HomePharmacistComponent', () => {
  let component: HomePharmacistComponent;
  let fixture: ComponentFixture<HomePharmacistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePharmacistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePharmacistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
