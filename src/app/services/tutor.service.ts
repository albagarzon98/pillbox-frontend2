import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tutor } from '../models/tutor';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TutorService {

  constructor( private httpClient: HttpClient ) { }

  private saveGender ( gender: string ) {
    localStorage.setItem('gender', gender);
  }
  
  private saveFullName ( fullName: string ) {
    localStorage.setItem('fullName', fullName);
  }
  
  post( tutor: Tutor ) {

    const authData = {
      fullName: tutor.fullName,
      email: tutor.email,
      phoneNumber: tutor.phoneNumber,
      dni: tutor.document,
      gender: tutor.gender
    };

    return this.httpClient.post(
      `${ url }tutor/`, 
      authData).pipe(
        map(res => {
          console.log(res);
          this.saveGender(res['tutor']['gender']);
          this.saveFullName(res['tutor']['fullName']);
        })
      );
  }

  patch ( tutor: Tutor) {
    return this.httpClient.patch(`${ url }tutor/`, tutor)
  }

  get () {
    return this.httpClient.get(`${ url }tutor/`);
  }
}
