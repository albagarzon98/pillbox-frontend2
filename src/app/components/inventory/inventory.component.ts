import { trigger, state, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Medication } from 'src/app/models/medication';
import { MedicationService } from '../../services/medication.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  animations: [
    trigger('fade', [
      
      transition('void => *', [
        style({ opacity: 0, transform: 'translate3d(0, -20%, 0)' }),
        animate(200)
      ]),
      
      transition('* => void', [
        animate(200, style({ opacity: 0, transform: 'translate3d(0, -20%, 0)' }))
      ]),

    ]),

    trigger('expand', [
      state('in', style({
        overflow: 'hidden',
        height: '70px',
      })),
      state('out', style({
        overflow: 'hidden',
        height: '240px',
      })),
      state('inBox', style({
        overflow: 'hidden',
        height: '85px',
      })),
      state('outBox', style({
        overflow: 'hidden',
        height: '250px',
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
      transition('inBox => outBox', animate('400ms ease-in-out')),
      transition('outBox => inBox', animate('400ms ease-in-out'))
    ])
  ]
})
export class InventoryComponent implements OnInit {

  expand: boolean = false;
  medications: Medication[] = [];
  state: string;
  stateBox: string;

  constructor(
    private router: Router,
    private medicationService: MedicationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getMedications();
    this.state = 'in';
    this.stateBox = 'inBox'
  }

  route () {
    return this.router.url;
  }

  expands () {
    this.state = this.state === 'out' ? 'in' : 'out';
    this.stateBox = this.stateBox === 'outBox' ? 'inBox' : 'outBox';
    this.expand = !this.expand;
  }

  viewMedication ( medication: Medication ) {
    this.medicationService.setMedicationData(medication);
    this.medicationService.setUserAction('viewMedication');
    this.router.navigateByUrl('/inventory/addMedicament');
  }

  modifyMedication ( medication: Medication) {
    this.medicationService.setMedicationData(medication);
    this.medicationService.setUserAction('modifyMedication');
    this.router.navigateByUrl('/inventory/addMedicament');
  }

  getMedications () {
    let branchId = this.authService.getBranchId();

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.medicationService.get(branchId).subscribe(res=>{
      
      this.medications = res['branchMedication'];
      console.log(this.medications);
      Swal.close();
    },err=>{
      console.log(err);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al cargar sus medicamentos'
      });
    });
  }
  
  
  deleteMedication ( medication: Medication ) {
    
    Swal.fire({
      title: '¿Está seguro?',
      text: "El medicamento se eliminará de forma permanente.",
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
    
        this.medicationService.delete( medication.id ).subscribe(  res=>{
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text:'!Medicamento eliminado con éxito!',
            showConfirmButton: false,
          });
          setTimeout(()=>{
            this.getMedications();
          },1500);
        }, err=>{
          console.log(err);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al eliminar el medicamento'
          });
        }
      );
      }
    })
  }



}
