import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pharmacy } from '../models/pharmacy';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  pharmacyAdd: Pharmacy;
  
  constructor( private httpClient: HttpClient ) { }
  
  get () {
  }

  post (pharmacy: Pharmacy) {
    return this.httpClient.post(`${ url }pharmacy/`, pharmacy);
  }

  addPharmacy ( pharmacy: Pharmacy ) {
    this.pharmacyAdd = pharmacy;
  }

  getPharmacyAdd(): Pharmacy {
    return this.pharmacyAdd;
  }
}
