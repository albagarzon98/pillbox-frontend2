import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PharmacyRequest } from '../models/pharmacy-request';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PharmacyRequestService {

  constructor( private httpClient: HttpClient ) { }

  post ( pharmacyRequest: PharmacyRequest ) {
    return this.httpClient.post(`${url}pharmacyRequest/`, pharmacyRequest);
  }

  get() {
    return this.httpClient.get(`${url}pharmacyRequest/`);
  }

  patch ( pharmacyRequest ) {
    return this.httpClient.patch(`${url}pharmacyRequest/`, pharmacyRequest);
  }
}
