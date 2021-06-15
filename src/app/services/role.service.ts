import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  url: string;

  constructor ( private httpClient: HttpClient ) { 
    this.url = 'http://localhost:3000/v1/roles';
  }

  get() {
    return this.httpClient.get(this.url);
  }
}
