import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Patient } from '../models/patient';
import { HttpClient } from '@angular/common/http';

const url = environment.url;


@Injectable({
  providedIn: 'root'
})
export class PatientService {

  constructor( private httpClient: HttpClient ) { }

  post( patient: Patient ) {

    const authData = {
      fullName: patient.fullName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      dni: patient.document,
      gender: patient.gender
    };

    return this.httpClient.post(`${ url }patient/`, authData);
  }

  getGenders() {
    return this.httpClient.get(`${ url }users/genders`);
  }
}
