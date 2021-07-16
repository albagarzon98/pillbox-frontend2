import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  url: string;

  constructor ( private httpClient: HttpClient ) { 
  }

  get() {
    return this.httpClient.get(`${url}roles`);
  }
}
