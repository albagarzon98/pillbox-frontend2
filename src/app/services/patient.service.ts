import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Patient } from '../models/patient';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const url = environment.url;


@Injectable({
  providedIn: 'root'
})
export class PatientService {

  gender:string;

  constructor( private httpClient: HttpClient ) { }

  
  private saveGender ( gender: string ) {
    this.gender = gender;
    localStorage.setItem('gender', gender);
  }
  
  post( patient: Patient ) {

    const authData = {
      fullName: patient.fullName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      dni: patient.document,
      gender: patient.gender
    };

    return this.httpClient.post(
      `${ url }patient/`, 
      authData).pipe(
        map(res => {
          this.saveGender(res['patient']['0']['gender']);
        })
      );
  }

  get () {
    return this.httpClient.get(`${ url }patient/`);
  }

  getGenders() {
    return this.httpClient.get(`${ url }users/genders`);
  }
}
