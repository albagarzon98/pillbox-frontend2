import { Component, OnInit } from '@angular/core';
import { PharmacyService } from '../../services/pharmacy.service';
import { Pharmacy } from '../../models/pharmacy';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent implements OnInit {

  pharmacies: Pharmacy[];
  
  constructor(
    private pharmacyService: PharmacyService
  ) { }

  ngOnInit(): void {
    this.getPharmacies();
  }

  getPharmacies () {

  }

}
