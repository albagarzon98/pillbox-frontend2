import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tutor } from '../models/tutor';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Patient } from '../models/patient';
import { throwError } from 'rxjs';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TutorService {

  patientData: Patient;
  userAction:string;

  constructor( private httpClient: HttpClient ) { }

  setUserAction (userAction: string) {
    this.userAction = userAction;
  }

  getUserAction () {
    return this.userAction;
  }
  
  setPatientData ( patient: Patient ) {
    this.patientData = patient;
  }

  getPatientData () {
    return this.patientData;
  }
  
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

  getAssignedPatients (tutorId) {
    return this.httpClient.get(`${ url }tutor/patients/${tutorId}`);
  }

  sendAssignedPatientEmail( patient: Patient ) {

    const body = {
      patientEmail: patient.email,
    };    
    return this.httpClient.post(
      `${ url }tutor/send-assigned-patient-email/`, 
      body).pipe(
        map(res => {
          console.log(res);

        })
      );
  }

  deleteTutorPatient(patient: Patient, tutorId: string){
    const urlAPI = `${ url }/tutor/patients/${tutorId}`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: { patientId: patient.id }
    };

    return this.httpClient.delete(urlAPI, httpOptions).pipe(
      map(res => {
        console.log(res);
      })
    );
  }

  getUserReminders(patient: Patient) {
    const params = new HttpParams().set('userId', patient.user);
    return this.httpClient.get(`${url}tutor/userReminders`, { params });
  }

}
