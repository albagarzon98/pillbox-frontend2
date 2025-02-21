import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Medication } from '../../../models/medication';
import { MedicationService } from '../../../services/medication.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ReminderService } from '../../../services/reminder.service';

@Component({
  selector: 'app-add-medicament',
  templateUrl: './add-medicament.component.html',
  styleUrls: ['./add-medicament.component.css']
})
export class AddMedicamentComponent implements OnInit {

  submitted: boolean = false;
  FormMedication: FormGroup;
  userAction: string;
  medication: Medication;
  units = [];
  
  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private medicationService: MedicationService,
    private authService: AuthService,
    private reminderService: ReminderService
  ) { }

  ngOnInit(): void {
    this.FormMedication = this.formBuilder.group({
      medicationName: ['', [Validators.required, Validators.maxLength(55)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      grammage: ['',[Validators.maxLength(20)]],
      unit: ['', [Validators.required]]
    });

    this.userAction = this.medicationService.getUserAction();
    this.medication = this.medicationService.getMedicationData();
    this.getUnits();
    this.setFormValues();
  }

  getUnits() {
    this.reminderService.getUnits().subscribe(res=>{
      this.units = res['units'];
    },err=>{
      console.log(err.message);
  
      Swal.fire({
        icon: 'error',
        text: err.message,
        title: 'Error al obtener las unidades.'
      });
    })
  }
  
  setFormValues () {
    if ( this.userAction != 'newMedication' ) {
      this.FormMedication.patchValue({
          medicationName: this.medication.medicationName,
          description: this.medication.description,
          grammage: this.medication.grammage,
          unit: this.medication.unit

      });
    };
    if ( this.userAction == 'viewMedication' ) {
      this.FormMedication.disable();
    }
  }

  onSubmit( form: FormGroup ) { 
    
    this.submitted = true;
    if ( form.invalid ) {
      return;
    }

    let medication: Medication;

    if ( this.userAction == 'newMedication' ) {

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
          showConfirmButton: false
        });
        setTimeout(()=>{
          this.router.navigateByUrl('/inventory');
        },1200);
      }, err => {
        console.log(err.error.message);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al crear el medicamento'
        });
      });
    };
    
    if ( this.userAction == 'modifyMedication') {

      medication = {...this.FormMedication.value};

      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text:'Espere por favor...'
      });
      Swal.showLoading();
      this.medicationService.patch(this.medication.id, medication).subscribe(res=>{
        console.log(res);
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text:'¡Medicamento modificado con éxito!',
          showConfirmButton: false

        });
  
        setTimeout(()=>{
          this.router.navigateByUrl('/inventory');
        },1200);

      },err=>{
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al modificar el medicamento'
        });
      })
    };

  }

}
