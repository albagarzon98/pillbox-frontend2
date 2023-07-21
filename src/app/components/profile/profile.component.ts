import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/models/patient';
import { PatientService } from '../../services/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user';
import { Pharmacist } from 'src/app/models/pharmacist';
import { Tutor } from 'src/app/models/tutor';
import { PharmacistService } from 'src/app/services/pharmacist.service';
import { TutorService } from 'src/app/services/tutor.service';
import { AuthService } from 'src/app/services/auth.service';

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
  pharmacist: Pharmacist = new Pharmacist();
  tutor: Tutor = new Tutor();

  genders = [];
  role ='';
  modify:boolean = false;

  constructor(
    private patientService: PatientService,
    private pharmacistService: PharmacistService,
    private tutorService: TutorService,
    private authService: AuthService,
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
    this.role = this.authService.getRole();

    if (this.role == 'paciente') {
      this.getPatient();
    }else if (this.role == 'farmaceutico') {      
      this.getPharmacist();
    } else if (this.role == 'tutor') {
      this.getTutor();
    }
    this.FormProfile.disable();
  }

  getGenders() {
    this.patientService.getGenders().subscribe( res => {
      this.genders = res['genders'];
    });
  }

  getPatient () {
    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
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

      Swal.close();
    }, err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al cargar sus datos'
      });
    });
  }

  getPharmacist () {
    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.pharmacistService.get().subscribe(res => {   
      this.FormProfile.patchValue({
        fullName: res['pharmacist']['0']['fullName'],
        dni: res['pharmacist']['0']['dni'],
        gender: res['pharmacist']['0']['gender'],
        phoneNumber: res['pharmacist']['0']['phoneNumber'],
        email: res['pharmacist']['0']['email']
      });

      this.pharmacist.document = res['pharmacist']['0']['dni'];
      this.pharmacist.email = res['pharmacist']['0']['email'];
      this.pharmacist.fullName = res['pharmacist']['0']['fullName'];
      this.pharmacist.gender = res['pharmacist']['0']['gender'];
      this.pharmacist.phoneNumber = res['pharmacist']['0']['phoneNumber'];

      Swal.close();
    }, err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al cargar sus datos'
      });
    });
  }

  getTutor () {
    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.tutorService.get().subscribe(res => {   
      this.FormProfile.patchValue({
        fullName: res['tutor']['0']['fullName'],
        dni: res['tutor']['0']['dni'],
        gender: res['tutor']['0']['gender'],
        phoneNumber: res['tutor']['0']['phoneNumber'],
        email: res['tutor']['0']['email']
      });

      this.tutor.document = res['tutor']['0']['dni'];
      this.tutor.email = res['tutor']['0']['email'];
      this.tutor.fullName = res['tutor']['0']['fullName'];
      this.tutor.gender = res['tutor']['0']['gender'];
      this.tutor.phoneNumber = res['tutor']['0']['phoneNumber'];

      Swal.close();
    }, err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al cargar sus datos'
      });
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

    if (this.role == 'paciente') {
      this.patient = { ...this.FormProfile.value }; 

    }else if (this.role == 'farmaceutico') {
      this.pharmacist = { ...this.FormProfile.value }; 

    }else if (this.role == 'tutor') {
      this.tutor = { ...this.FormProfile.value }; 
    }
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
      if (this.role == 'paciente') {
        this.patientService.patch(this.patient).subscribe( res => {
          
          localStorage.setItem('fullName', res['patient']['fullName']);
          localStorage.setItem('name', res['patient']['fullName']);
          localStorage.setItem('gender', res['patient']['gender']);
        }, (err)=>{
          console.log(err.error.message);
        });
      }else if (this.role == 'farmaceutico') {
        this.pharmacistService.patch(this.pharmacist).subscribe( res => {
          
          localStorage.setItem('fullName', res['pharmacist']['fullName']);
          localStorage.setItem('name', res['pharmacist']['fullName']);
          localStorage.setItem('gender', res['pharmacist']['gender']);
        }, (err)=>{
          console.log(err.error.message);
        });
      }else if (this.role == 'tutor') {
        this.tutorService.patch(this.tutor).subscribe( res => {
          
          localStorage.setItem('fullName', res['tutor']['fullName']);
          localStorage.setItem('name', res['tutor']['fullName']);
          localStorage.setItem('gender', res['tutor']['gender']);
        }, (err)=>{
          console.log(err.error.message);
        });
      }


      console.log(res);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text:'¡Datos modificados correctamente!',
        showConfirmButton: false,
        timer: 1000
      });

      setTimeout(()=>{
        
        if (this.role == 'paciente') {
          this.getPatient();
        }else if (this.role == 'farmaceutico') {
          this.getPharmacist();
        }else if (this.role == 'tutor') {
          this.getTutor();
        }
      },1200);

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
