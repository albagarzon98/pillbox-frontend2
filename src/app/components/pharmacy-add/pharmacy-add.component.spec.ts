import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyAddComponent } from './pharmacy-add.component';

describe('PharmacyAddComponent', () => {
  let component: PharmacyAddComponent;
  let fixture: ComponentFixture<PharmacyAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PharmacyAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
