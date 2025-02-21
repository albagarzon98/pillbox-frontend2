import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userId:string;
  
  constructor( private httpClient: HttpClient ) { 
    this.readId();
  }

  readId(): string {
    if (localStorage.getItem('id')) {
      this.userId = localStorage.getItem('id');
    } else {
      this.userId = '';
    }
    return this.userId;
  }

  patch(user, id) {
    return this.httpClient.patch(`${url}users/${id}`, user);
  }

  get (id) {
    return this.httpClient.get(`${url}users/${id}`);
  }

  getAll() {
    return this.httpClient.get(`${url}users/?limit=100`);
  }

  changeUserStatus(id, status=false) {
    const body = {
      "status": status,
    };
    return this.httpClient.post(`${url}users/changeStatus/${id}`, body);
  }
}
