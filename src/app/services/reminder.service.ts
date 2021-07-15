import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reminder } from '../models/reminder';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  url: string;

  constructor( private httpClient: HttpClient ) { 
    this.url = 'http://localhost:3000/v1/reminder';
  }

  getUnits() {
    return this.httpClient.get(`${ this.url }/units`);
  }

  getFrequencies() {
    return this.httpClient.get(`${ this.url }/frequencies`);
  }

  get() {
    return this.httpClient.get(this.url);
  }

  post( reminder: Reminder) {
    return this.httpClient.post(this.url, reminder);
  }

  delete(id) {
    console.log(`id en el reminder service: ${id}`);
    return this.httpClient.delete(`${this.url}/${id}`)
  }

}
