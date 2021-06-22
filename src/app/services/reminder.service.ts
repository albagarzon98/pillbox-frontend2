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
    
    const token = localStorage.getItem('token');
    
    const httpOtions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.httpClient.get(this.url, httpOtions);
  }

  post( reminder: Reminder) {
    const token = localStorage.getItem('token');

    const httpOtions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.httpClient.post(this.url, reminder, httpOtions);
  }

}
