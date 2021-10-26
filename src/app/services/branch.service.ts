import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Branch } from '../models/branch';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  branchData: Branch;
  userAction: string;

  constructor( private httpClient: HttpClient ) { }

  setUserAction (userAction: string) {
    this.userAction = userAction;
  }

  getUserAction () {
    return this.userAction;
  }

  setBranchData ( branch: Branch ) {
    this.branchData = branch;
  }

  getBranchData () {
    return this.branchData;
  }

  post ( branch: Branch, pharmacyId: string ) {
    return this.httpClient.post(`${url}branch/${pharmacyId}`, branch);
  }

  patch ( branch: Branch, branchId: string ) {
    return this.httpClient.patch(`${url}branch/${branchId}`, branch);
  }

  delete ( branchId: string ) {
    return this.httpClient.delete(`${url}branch/${branchId}`);
  }

}
