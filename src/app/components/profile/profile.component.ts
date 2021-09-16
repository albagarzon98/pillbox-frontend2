import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/models/patient';
import { PatientService } from '../../services/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  FormProfile: FormGroup;
  submitted: boolean = false;

  user: UserModel = new UserModel();
  patient: Patient = new Patient();
  genders = [];
  modify:boolean = false;

  constructor(
    private patientService: PatientService,
    private userService: UserService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.FormProfile = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(55)]],
      email: ['', [Validators.required, Validators.email]],
      dni: [null, [Validators.required, Validators.pattern('[0-9]{7,8}')]],
      phoneNumber: [null, [Validators.required, Validators.pattern('[0-9]{10,11}')]],
      gender: ['', [Validators.required]]
    });

    this.getGenders();
    this.getPatient();
    this.FormProfile.disable();
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

  modifyProfile() {
    this.modify = !this.modify;
    if (this.modify) {
      this.FormProfile.enable();
    }
    if (!this.modify) {
      this.FormProfile.disable();
    }
  }

  onSubmit( form: FormGroup ) {
    
    this.submitted = true;
    if ( form.invalid ) {
      return;
    }

    this.patient = { ...this.FormProfile.value }; 
    this.user.email = this.FormProfile.value.email;
    this.user.name = this.FormProfile.value.fullName;

    const id = this.userService.readId();

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();

    this.userService.patch(this.user, id).subscribe(res => {
      
      this.patientService.patch(this.patient).subscribe( res => {
        console.log(res);
        localStorage.setItem('fullName', res['patient']['fullName']);
        localStorage.setItem('name', res['patient']['fullName']);
        localStorage.setItem('gender', res['patient']['gender']);
      }, (err)=>{
        console.log(err.error.message);
      });

      console.log(res);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text:'¡Datos modificados correctamente!'
      });

      this.getPatient();
      this.submitted = false;
      this.modifyProfile();
    }, (err) => {
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
