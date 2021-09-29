import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Pharmacy } from '../models/pharmacy';


@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  pharmacyAdd: Pharmacy;
  
  constructor() { }
  
  get () {
  }

  addPharmacy ( pharmacy: Pharmacy ) {
    this.pharmacyAdd = pharmacy;
  }

  getPharmacyAdd(): Pharmacy {
    return this.pharmacyAdd;
  }
}
