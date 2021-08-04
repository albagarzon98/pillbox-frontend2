import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reminder } from '../models/reminder';
import { environment } from 'src/environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  url: string;

  constructor( private httpClient: HttpClient ) { 
  }

  getUnits() {
    return this.httpClient.get(`${ url }reminder/units`);
  }

  getFrequencies() {
    return this.httpClient.get(`${ url }reminder/frequencies`);
  }

  get() {
    return this.httpClient.get(`${ url }reminder`);
  }

  post( reminder: Reminder ) {
    return this.httpClient.post(`${ url }reminder`, reminder);
  }

  delete (id) {
    return this.httpClient.delete(`${url}reminder/${id}`)
  }

  patch (id, reminder) {
    return this.httpClient.patch(`${url}reminder/${id}`, reminder)
  }
}
