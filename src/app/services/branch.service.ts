import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Branch } from '../models/branch';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor( private httpClient: HttpClient ) { }

  post ( branch: Branch, pharmacyId: string ) {
    return this.httpClient.post(`${url}branch/${pharmacyId}`, branch);
  }
}
