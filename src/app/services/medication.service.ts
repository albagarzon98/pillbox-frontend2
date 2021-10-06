import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Medication } from '../models/medication';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class MedicationService {

  medicationData: Medication;
  userAction:string;

  constructor( private httpClient: HttpClient ) { }

  setUserAction (userAction: string) {
    this.userAction = userAction;
  }

  getUserAction () {
    return this.userAction;
  }
  
  setMedicationData ( medication: Medication ) {
    this.medicationData = medication;
  }

  getMedicationData () {
    return this.medicationData;
  }
  
  get ( branchId: string ) {
    return this.httpClient.get(`${ url }branchMedication/byBranchId/${ branchId }`);
  }
  
  post( medication: Medication ) {
    return this.httpClient.post(`${ url }branchMedication/`, medication);
  }

  patch ( id: string, medication: Medication ) {
    return this.httpClient.patch(`${url}branchMedication/${id}`, medication);
  }

  delete ( id: string ) {
    return this.httpClient.delete(`${url}branchMedication/${id}`);
  }
}
