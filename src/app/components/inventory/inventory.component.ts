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
  ]
})
export class InventoryComponent implements OnInit {

  expand: boolean = false;
  medications: Medication[];

  constructor(
    private router: Router,
    private medicationService: MedicationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getMedications();
  }

  route () {
    return this.router.url;
  }

  expands () {
    this.expand = !this.expand;
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

}
