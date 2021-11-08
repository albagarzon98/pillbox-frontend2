import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor( private httpClient: HttpClient ) { }

  get ( branchId: string ) {
    return this.httpClient.get(`${ url }reservation/byBranchId/${ branchId }`);
  }
}
