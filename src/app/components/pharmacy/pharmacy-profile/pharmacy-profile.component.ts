import { Component, OnInit } from '@angular/core';
import { Branch } from 'src/app/models/branch';
import { Pharmacy } from 'src/app/models/pharmacy';
import { PharmacyService } from 'src/app/services/pharmacy.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { BranchService } from '../../../services/branch.service';
import { Medication } from 'src/app/models/medication';
import { MedicationService } from '../../../services/medication.service';
import { AppointmentService } from '../../../services/appointment.service';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-pharmacy-profile',
  templateUrl: './pharmacy-profile.component.html',
  styleUrls: ['./pharmacy-profile.component.css'],
  animations: [
    trigger('expand', [
      state('in', style({
        height: '40px',
        overflow: 'hidden'
      })),
      state('out', style({
        height: '205px',
        overflow: 'hidden'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})
export class PharmacyProfileComponent implements OnInit {

  pharmacy: Pharmacy;
  branches: Branch[] = [];
  branchSelected: Branch;
  branchMedications = [];
  userAction: string = 'branches';
  role: string;
  
  constructor(
    private pharmacyService: PharmacyService,
    private authService: AuthService,
    private router: Router,
    private branchService: BranchService,
    private medicationService: MedicationService,
    private appointmentService: AppointmentService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {
    const userAction = localStorage.getItem('userAction');
    const branchData = JSON.parse(localStorage.getItem('branchData'));

    this.appointmentService.setUserAction(userAction);
    this.appointmentService.setBranchData(branchData);
    
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

  expandData( medication ) {
      medication.state = medication.state === 'out' ? 'in' : 'out';
  }

  back () {
    this.userAction = 'branches';
  }

  addReminder ( medication ) {
    this.medicationService.setUserAction('addReminder');
    this.medicationService.setMedicationData( medication );
    this.router.navigateByUrl('/reminder');
  }

  branchSelect ( branch:Branch ) {
    let branchId = branch.branchId;
    this.branchSelected = branch;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.medicationService.get(branchId).subscribe(res=>{
      console.log(res);
      this.branchMedications = res['branchMedication'];
      Swal.close();
    },err=>{
      console.log(err);
      Swal.fire({
        icon: 'error',
        text: `${err.error.error}`,
        title: 'Error al cargar los medicamentos.'
      });
    });
    
    this.userAction = 'branchMedications';
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
    let branchId1 = branch.id;
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
    
        let branchDelete = branch['branchId'];

        console.log(branchDelete);
        console.log(this.pharmacy.id);
        
        this.pharmacyService.deleteBranch(this.pharmacy.id, branchDelete).subscribe(res=>{
          console.log(res);
          this.branchService.delete( branchId1 ).subscribe(  res=>{
          
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
        },err=>{
          console.log(err);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al eliminar la sucursal del listado'
          });
        })
        
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

  modifyPharmacy( pharmacy ) {
    
    this.pharmacyService.setUserAction('modifyPharmacy');
    this.pharmacyService.setPharmacyData(pharmacy);
    
    this.router.navigateByUrl('/pharmacyRequests/add');
  }

  deletePharmacy ( pharmacy ) {
    let pharmacyId1 = pharmacy.id;
    Swal.fire({
      title: '¿Está seguro?',
      text: "Se eliminará la farmacia y todas las sucursales asociadas de forma permanente.",
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
    
        console.log('pharmacy',pharmacy);

        this.branches.forEach(branch => {
          console.log('branch', branch);
          (this.branchService.delete( branch.id ).subscribe(  res=>{
            console.log(res);

          }, err=>{
            console.log(err);
          })
    )});

        let pharmacyDelete = pharmacy['pharmacyId'];

        console.log(pharmacyDelete);
        console.log(this.pharmacy.id);

          this.pharmacyService.delete( pharmacyId1 ).subscribe(  res=>{
            console.log(res);

            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              text:'!Farmacia eliminada con éxito!',
              showConfirmButton: false,
            });
  
            setTimeout(()=>{
              this.router.navigateByUrl('/pharmacy');
            },1200);
  
          }, err=>{
            console.log(err);
            Swal.fire({
              icon: 'error',
              text: err.error.message,
              title: 'Error al eliminar la farmcia'
            });
          }
        );
        
      }
    })
  }

  takeAppointment ( branch ) {
    
    this.appointmentService.setUserAction('takeAppointment');
    this.appointmentService.setBranchData( branch );

    localStorage.setItem('userAction', 'takeAppointment');
    localStorage.setItem('branchData', JSON.stringify(branch));

    this.router.navigateByUrl('/appointment');
  }


}
