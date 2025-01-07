import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient) { }

  getPharmacyRequests(formValues) {
    const queryParams = this.createQueryParams(formValues);

    return this.httpClient.get(`${url}pharmacyRequest${queryParams}`);
  }

  getReminderHistory(formValues) {
    const queryParams = this.createQueryParams(formValues);
    return this.httpClient.get(`${url}reminderHistory${queryParams}`);
  }

  createQueryParams(formValues) {
    let queryParams = "";

    if (Object.keys(formValues).length === 0) {
      return queryParams;
    }

    queryParams = "?";

    for (let formValue in formValues) {
      queryParams += `${formValue}=${formValues[formValue]}&`;
    }

    return queryParams.slice(0, queryParams.length - 1)
  }
}
