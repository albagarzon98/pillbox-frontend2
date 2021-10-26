import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class BranchMedicationReminderService {

  constructor( private httpClient: HttpClient ) { }

  post ( branchMedicationReminder ) {
    return this.httpClient.post(`${ url }branchMedicationReminder/`, branchMedicationReminder);
  }
}
