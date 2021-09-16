import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/models/patient';
import { PatientService } from '../../services/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  FormProfile: FormGroup;
  submitted: boolean = false;

  patient: Patient = new Patient();
  genders = [];

  constructor(
    private patientService: PatientService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.FormProfile = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(55)]],
      email: ['', [Validators.required, Validators.email]],
      dni: [null, [Validators.required, Validators.pattern('[0-9]{7,8}')]],
      phoneNumber: [null, Validators.required],
      gender: ['', [Validators.required]]
    });

    this.getGenders();
    this.getPatient();
  }

  getGenders() {
    this.patientService.getGenders().subscribe( res => {
      this.genders = res['genders'];
    });
  }

  getPatient () {
    this.patientService.get().subscribe(res => {   
      this.FormProfile.patchValue({
        fullName: res['patient']['0']['fullName'],
        dni: res['patient']['0']['dni'],
        gender: res['patient']['0']['gender'],
        phoneNumber: res['patient']['0']['phoneNumber'],
        email: res['patient']['0']['email']
      });

      this.patient.document = res['patient']['0']['dni'];
      this.patient.email = res['patient']['0']['email'];
      this.patient.fullName = res['patient']['0']['fullName'];
      this.patient.gender = res['patient']['0']['gender'];
      this.patient.phoneNumber = res['patient']['0']['phoneNumber'];
    });
  }

  onSubmit( form: FormGroup ) {
    
    this.submitted = true;
    if ( form.invalid ) {
      return;
    }

    this.patient = { ...this.FormProfile.value };

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.patientService.patch(this.patient).subscribe( res => {
      
      console.log(res);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text:'¡Datos modificados correctamente!'
      });

      this.getPatient();
      localStorage.setItem('fullName', res['patient']['fullName']);
      localStorage.setItem('gender', res['patient']['gender']);

      this.submitted = false;
    }, (err)=>{
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al modificar sus datos'
      });

      this.submitted = false;
    });

  }

}
