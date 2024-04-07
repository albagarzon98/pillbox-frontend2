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

  constructor( private httpClient: HttpClient ) { }

  
  private saveGender ( gender: string ) {
    localStorage.setItem('gender', gender);
  }

  private saveFullName ( fullName: string ) {
    localStorage.setItem('fullName', fullName);
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
          console.log(res);
          this.saveGender(res['patient']['gender']);
          this.saveFullName(res['patient']['fullName']);
        })
      );
  }

  patch ( patient: Patient) {
    return this.httpClient.patch(`${ url }patient/`, patient)
  }

  get () {
    return this.httpClient.get(`${ url }patient/`);
  }

  getGenders() {
    return this.httpClient.get(`${ url }users/genders`);
  }

  getByUserId(userId) {
    return this.httpClient.get(`${ url }patient/userId/${ userId }`);
  }
}
