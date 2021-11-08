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
  requestId: string;
  
  constructor( private httpClient: HttpClient ) { }
  
  get () {
    return this.httpClient.get(`${ url }pharmacy/`);
  }

  getPharmacy ( pharmacyId: string ) {
    return this.httpClient.get(`${ url }pharmacy/${pharmacyId}`);
  }

  post (pharmacy: Pharmacy) {
    return this.httpClient.post(`${ url }pharmacy/`, pharmacy);
  }

  addPharmacy ( pharmacy: Pharmacy, requestId: string ) {
    this.pharmacyAdd = pharmacy;
    this.requestId = requestId;
  }

  profilePharmacy ( pharmacyId: string ) {
    localStorage.setItem('profilePharmacy', pharmacyId);
  }

  getPharmacyAdd(): Pharmacy {
    return this.pharmacyAdd;
  }

  getRequestId () {
    return this.requestId;
  }

  getPharmacyBranches ( pharmacyId: string ) {
    return this.httpClient.get(`${url}pharmacy/branches/${pharmacyId}`);
  }

  deleteBranch ( pharmacyId:string, branchId ) {
    return this.httpClient.delete(`${url}pharmacy/branches/${pharmacyId}`, branchId);
  }
}
