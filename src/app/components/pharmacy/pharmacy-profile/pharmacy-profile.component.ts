import { Component, OnInit } from '@angular/core';
import { Branch } from 'src/app/models/branch';
import { Pharmacy } from 'src/app/models/pharmacy';
import { PharmacyService } from 'src/app/services/pharmacy.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pharmacy-profile',
  templateUrl: './pharmacy-profile.component.html',
  styleUrls: ['./pharmacy-profile.component.css']
})
export class PharmacyProfileComponent implements OnInit {

  pharmacy: Pharmacy;
  branches: Branch[] = [];
  role: string;
  
  constructor(
    private pharmacyService: PharmacyService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.pharmacy = this.pharmacyService.getPharmacyProfile();
    this.getPharmacyBranches();
    this.setRole();
  }

  setRole() {
    this.role = this.authService.getRole();
  }

  modifyBranch( branch ) {

  }

  deleteBranch ( branch ) {

  }

  getPharmacyBranches () {
    let pharmacyId = this.pharmacy.id;
    this.pharmacyService.getPharmacyBranches( pharmacyId ).subscribe(res=>{
      console.log(res);
      this.branches = res['branches'];
      Swal.close();
    },err=>{
      console.log(err);
      Swal.fire({
        icon: 'error',
        text: `${err.error.error}`,
        title: 'Error al cargar las sucursales.'
      });
    });
  }

}
