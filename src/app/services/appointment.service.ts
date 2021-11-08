import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Appointment } from '../models/appointment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  userAction: string;
  appointmentData: Appointment;
  
  constructor( private httpClient: HttpClient ) { }

  getUserAction () {
    return this.userAction;
  }

  setUserAction ( userAction: string ) {
    this.userAction = userAction;
  }

  getAppointmentData () {
    return this.appointmentData;
  }

  setAppointmentData ( appointment: Appointment ) {
    this.appointmentData = appointment;
  }
  
  get ( branchId: string ) {
    return this.httpClient.get(`${ url }reservation/byBranchId/${ branchId }`);
  }

  post ( appointment ) {
    return this.httpClient.post(`${ url }reservation`, appointment);
  }
}
