import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Medication } from '../../../models/medication';
import { MedicationService } from '../../../services/medication.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-medicament',
  templateUrl: './add-medicament.component.html',
  styleUrls: ['./add-medicament.component.css']
})
export class AddMedicamentComponent implements OnInit {

  submitted: boolean = false;
  FormMedication: FormGroup;
  
  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private medicationService: MedicationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.FormMedication = this.formBuilder.group({
      medicationName: ['', [Validators.required, Validators.maxLength(55)]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    })
  }

  onSubmit( form: FormGroup ) { 
    this.submitted = true;
    if ( form.invalid ) {
      return;
    }

    let medication: Medication;
    medication = {...this.FormMedication.value};
    medication.branchId = this.authService.getBranchId();

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.medicationService.post(medication).subscribe(res => {

      console.log(res);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text:'¡Medicamento creado con éxito!',
        // showConfirmButton: false,
      });

      this.router.navigateByUrl('/inventory');
    }, err => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al crear el medicamento'
      });
    });
  }

}
