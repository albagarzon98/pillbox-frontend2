import { Component, OnInit } from '@angular/core';
import { PharmacyService } from '../../services/pharmacy.service';
import { Pharmacy } from '../../models/pharmacy';
import Swal from 'sweetalert2';

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
    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.getPharmacies();
  }

  getPharmacies () {
    this.pharmacyService.get().subscribe(res=>{
      
      console.log(res);
      this.pharmacies = res['pharmacies'];
      Swal.close();
    },err=>{
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al obtener las farmacias'
      });
    });
  }

}
