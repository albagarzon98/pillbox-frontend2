import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Pharmacies } from '../models/pharmacy';


@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  constructor() { }
  get () {
    return of(Pharmacies);
  }
}
