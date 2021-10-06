import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Medication } from '../models/medication';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  constructor( private httpClient: HttpClient ) { }

  get ( branchId: string ) {
    return this.httpClient.get(`${ url }branchMedication/byBranchId/${ branchId }`);
  }
  
  post( medication: Medication ) {
    return this.httpClient.post(`${ url }branchMedication/`, medication);
  }
}
