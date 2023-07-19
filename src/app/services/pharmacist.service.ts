import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pharmacist } from '../models/pharmacist';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class PharmacistService {

  constructor( private httpClient: HttpClient ) { }

  private saveGender ( gender: string ) {
    localStorage.setItem('gender', gender);
  }
  
  private saveFullName ( fullName: string ) {
    localStorage.setItem('fullName', fullName);
  }
  
  post( pharmacist: Pharmacist ) {

    const authData = {
      fullName: pharmacist.fullName,
      email: pharmacist.email,
      phoneNumber: pharmacist.phoneNumber,
      dni: pharmacist.document,
      gender: pharmacist.gender
    };

    return this.httpClient.post(
      `${ url }pharmacist/`, 
      authData).pipe(
        map(res => {
          console.log(res);
          this.saveGender(res['pharmacist']['gender']);
          this.saveFullName(res['pharmacist']['fullName']);
        })
      );
  }

  patch ( pharmacist: Pharmacist) {
    return this.httpClient.patch(`${ url }pharmacist/`, pharmacist)
  }

  get () {
    return this.httpClient.get(`${ url }pharmacist/`);
  }
}
