import { Component, OnInit } from '@angular/core';
import { Branch } from 'src/app/models/branch';
import { Pharmacy } from 'src/app/models/pharmacy';
import { PharmacyService } from 'src/app/services/pharmacy.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { BranchService } from '../../../services/branch.service';

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
    private authService: AuthService,
    private router: Router,
    private branchService: BranchService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
  };
  this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.setRole();
    this.getPharmacyProfile();
  }

  setRole() {
    this.role = this.authService.getRole();
  }

  getPharmacyProfile () {
    if ( localStorage.getItem('profilePharmacy') ) {
      let pharmacyId = localStorage.getItem('profilePharmacy');
      this. pharmacyService.getPharmacy( pharmacyId ).subscribe(res=>{
        console.log(res);
        this.pharmacy = res['pharmacy'];
        this.getPharmacyBranches();
        },err=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          text: `${err.error.error}`,
          title: 'Error al cargar la farmacia.'
        });
      });
    } else {
      this.router.navigateByUrl('/pharmacy');
    }
  }

  modifyBranch( branch ) {
    this.branchService.setUserAction('modifyBranch');
    this.branchService.setBranchData(branch);
    this.router.navigateByUrl('/pharmacy/addBranch');
  }

  deleteBranch ( branch ) {
    let branchId = branch.id;
    Swal.fire({
      title: '¿Está seguro?',
      text: "La sucursal se eliminará de forma permanente.",
      icon: 'warning',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      showCancelButton: true,
      reverseButtons: true

    }).then((result)=>{
      if(result.isConfirmed){
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text:'Espere por favor...'
        });
        Swal.showLoading();
    
        this.branchService.delete( branchId ).subscribe(  res=>{
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text:'!Sucursal eliminada con éxito!',
            showConfirmButton: false,
          });
          setTimeout(()=>{
            this.router.navigateByUrl('/pharmacy/profile');
          },1200);

        }, err=>{
          console.log(err);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al eliminar la sucursal'
          });
        }
      );
      }
    })
  }

  addBranch (  ) {
    this.branchService.setUserAction('newBranch');
    this.router.navigateByUrl('/pharmacy/addBranch');
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
