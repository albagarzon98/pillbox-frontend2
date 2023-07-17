import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Appointment } from '../models/appointment';
import { Branch } from '../models/branch';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  userAction: string;
  appointmentData: Appointment;
  branchData: Branch
  
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
  
  get ( branchId: string, status: string ) {
    const params = { status: status };
    return this.httpClient.get(`${ url }reservation/byBranchId/${ branchId }`, { params: params });
  }

  post ( appointment ) {
    return this.httpClient.post(`${ url }reservation`, appointment);
  }

  setBranchData ( branch: Branch ) {
    this.branchData = branch;
  }

  takeAppointment ( appointmentId ) {
    const body = {
      reservationId: appointmentId
    };
    return this.httpClient.patch(`${ url }reservation/take`, body);
  }

  rejectAppointment ( appointmentId ) {
    const body = {
      reservationId: appointmentId
    };
    return this.httpClient.patch(`${ url }reservation/reject`, body);
  }

  delete (id) {
    return this.httpClient.delete(`${url}reservation/${id}`)
  }

  patch (id, reservation) {
    return this.httpClient.patch(`${url}reservation/${id}`, reservation)
  }
}
