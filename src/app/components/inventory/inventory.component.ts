import { trigger, state, transition, style, animate } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
        height: '80px',
      })),
      state('out', style({
        overflow: 'hidden',
        height: '245px',
      })),
      state('CSV', style({
        overflow: 'hidden',
        height: '390px',
      })),
      state('inBox', style({
        overflow: 'hidden',
        height: '85px',
      })),
      state('inBoxMobile', style({
        overflow: 'hidden',
        height: '85px',
      })),
      state('outBox', style({
        overflow: 'hidden',
        height: '250px',
      })),
      state('CSVBox', style({
        overflow: 'hidden',
        height: '390px',
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out')),
      transition('out => CSV', animate('400ms ease-in-out')),
      transition('CSV => out', animate('400ms ease-in-out')),
      transition('CSV => in', animate('600ms ease-in-out')),
      transition('inBox => outBox', animate('400ms ease-in-out')),
      transition('outBox => inBox', animate('400ms ease-in-out')),
      transition('outBox => CSVBox', animate('400ms ease-in-out')),
      transition('CSVBox => outBox', animate('400ms ease-in-out')),
      transition('CSVBox => inBox', animate('600ms ease-in-out'))
    ])
  ]
})
export class InventoryComponent implements OnInit {

  @ViewChild('inputFile', {static: false})
  InputFile: ElementRef;

  expand: boolean = false;
  medications: Medication[] = [];
  state: string;
  stateBox: string;
  files: File[] = [];
  inputState: string = 'isEmpty';
  uploaded: boolean = false;

  constructor(
    private router: Router,
    private medicationService: MedicationService,
    private authService: AuthService
  ) {  
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    };
    this.router.onSameUrlNavigation = 'reload';
   }

  ngOnInit(): void {
    if ( this.route()=='/inventory' ) {
      this.getMedications();
    }
    this.state = 'in';
    this.stateBox = 'inBox'
  }

  screenWidth () {
    return window.screen.width;
  }
  
  route () {
    return this.router.url;
  }

  resetInput () {
    this.InputFile.nativeElement.value = "";
    this.inputState = 'isEmpty';
    this.files = [];
    this.uploaded = false;
  }
  
  expands () {
    
    if ( this.state == 'CSV') {
      this.state = 'in';
      this.files = [];

      setTimeout(()=>{
        this.InputFile.nativeElement.value = "";
        this.uploaded = false;
      },600);
    } else {
      this.state = this.state === 'out' ? 'in' : 'out';
      this.resetInput();
    }

    if ( this.stateBox == 'CSVBox') {
      this.stateBox = 'inBox'
      this.files = [];

      setTimeout(()=>{
        this.InputFile.nativeElement.value = "";
        this.uploaded = false;
      },600);
    } else {
      this.stateBox = this.stateBox === 'outBox' ? 'inBox' : 'outBox';
      this.resetInput();
    }
    
    this.expand = !this.expand;
  }

  infoCSV () {

  }

  addCSV() {
    this.state = this.state === 'CSV' ? 'out' : 'CSV';
    this.stateBox = this.stateBox === 'CSVBox' ? 'outBox' : 'CSVBox';
    if ( this.state == 'out' || this.stateBox == 'outBox') {
      setTimeout(()=>{
        this.uploaded = false;
      },300);
    }
  }

  captureFile(event): any {
    this.files = [];
    this.files.push( event.target.files[0] );
    if ( !this.files[0] ) {
      this.uploaded = true;
      this.inputState = 'isEmpty';
    }
    if ( this.files[0] && this.files[0].type != 'application/vnd.ms-excel' ) {
      this.uploaded = true;
      this.inputState = 'incorrectFile';
    }
    if ( this.files[0] && this.files[0].type == 'application/vnd.ms-excel' ) {
      this.inputState = '';
    }
  }
  
  uploadFile(): any {

    this.uploaded = true;
    if ( this.files.length === 0 || !this.files[0] ) {
      this.inputState = 'isEmpty';
      return;
    }
    if ( this.files[0] && this.files[0].type != 'application/vnd.ms-excel' ) {
      return;
    }

    let branchId = this.authService.getBranchId();
    console.log(this.files[0]);
  
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...',
      title: 'Cargando archivo'
    });
    Swal.showLoading();
    this.medicationService.postCSV(this.files[0], branchId).subscribe(res=>{
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text:'!Medicamentos cargados con éxito!',
        showConfirmButton: false,
      });
      
      setTimeout(()=>{
        this.router.navigateByUrl('/inventory');
      },1200);

    },err=>{
      console.log(err);
      Swal.fire({
        icon: 'error',
        text: `${err.error.error}`,
        title: 'Error al cargar el archivo'
      });
      this.uploaded = false;
    });

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

  newMedication () {
    this.medicationService.setUserAction('newMedication');
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
            this.router.navigateByUrl('/inventory');
          },1200);

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
