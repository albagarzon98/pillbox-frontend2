import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/models/patient';
import { PatientService } from '../../services/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/user';
import { PharmacistService } from 'src/app/services/pharmacist.service';
import { TutorService } from 'src/app/services/tutor.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

const roleTranslate = {
  paciente: "patient",
  farmaceutico: "pharmacist",
  tutor: "tutor",
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  FormProfile: FormGroup;
  submitted: boolean = false;

  user: UserModel = new UserModel();
  roleModel: Patient = new Patient();
  id: string;

  genders = [];
  role = '';
  modify: boolean = false;

  services = {
    paciente: this.patientService,
    farmaceutico: this.pharmacistService,
    tutor: this.tutorService,
  };

  constructor(
    private router: Router,
    private patientService: PatientService,
    private pharmacistService: PharmacistService,
    private tutorService: TutorService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
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

    const id = this.route.snapshot.paramMap.get('id');
    const role = this.route.snapshot.paramMap.get('role');

    if (id) {
      this.id = id;
      this.role = role;
    } else {
      this.role = this.authService.getRole();
      this.id = this.authService.getUserId();
    }

    if (this.role === "admin") {
      this.getAdminData();
      return;
    }

    this.getUserDataById(this.id, this.role, this.services);
  }

  volver() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.router.navigateByUrl('users');
    } else {
      this.router.navigateByUrl('home');
    }
  }

  getGenders() {
    this.patientService.getGenders().subscribe(res => {
      this.genders = res['genders'];
    });
  }

  getAdminData() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.userService.get(this.id).subscribe(res => {
      this.FormProfile.disable();

      this.FormProfile.patchValue({
        fullName: res["name"],
        dni: "",
        gender: "",
        phoneNumber: "",
        email: res["email"]
      });

      this.roleModel.fullName = res["name"];
      this.roleModel.isEnabled = res["isEnabled"];
      Swal.close();
    }, err => {
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al cargar sus datos'
      });
    })
  }

  getUserDataById(id, role, services) {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    services[`${role}`].getByUserId(id).subscribe(res => {
      this.FormProfile.disable();

      if (res[roleTranslate[`${role}`]].length === 0) {
        Swal.fire({
          icon: 'info',
          text: `No se han encontrado datos para el ${role} seleccionado.`,
          title: 'Información',
        })
        return;
      }

      this.FormProfile.patchValue({
        fullName: res[roleTranslate[`${role}`]]['0']['fullName'],
        dni: res[roleTranslate[`${role}`]]['0']['dni'],
        gender: res[roleTranslate[`${role}`]]['0']['gender'],
        phoneNumber: res[roleTranslate[`${role}`]]['0']['phoneNumber'],
        email: res[roleTranslate[`${role}`]]['0']['email']
      });

      this.roleModel.gender = res[roleTranslate[`${role}`]]['0']['gender'];
      this.roleModel.isEnabled = res[roleTranslate[`${role}`]]['0']['user']['isEnabled'];
      this.roleModel.fullName = res[roleTranslate[`${role}`]]['0']['fullName'];

      Swal.close();
    }, err => {
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al cargar los datos del usuario'
      });
    })
  }

  modifyProfile() {
    this.modify = !this.modify;
    if (this.modify) {
      this.FormProfile.enable();
      this.FormProfile.controls['email'].disable();
    }
    if (!this.modify) {
      this.FormProfile.disable();
    }
  }

  updateRoleUser() {
    const role = roleTranslate[`${this.role}`];

    if (this.role !== "admin") {
      this.services[`${this.role}`].patchById(this.id, this.roleModel).subscribe(res => {
        localStorage.setItem('fullName', res[role]['fullName']);
        localStorage.setItem('name', res[role]['fullName']);
        localStorage.setItem('gender', res[role]['gender']);
      }, (err) => {
        console.log(err.error.message);
      });
    }
  }

  changeUserStatus() {
    const messagePart = this.roleModel.isEnabled ? "desactivado" : "activado";

    Swal.fire({
      title: '¿Está seguro?',
      text: `El usuario será ${messagePart}.`,
      icon: 'warning',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      showCancelButton: true,
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...'
        });
        Swal.showLoading();

        this.userService.changeUserStatus(this.id, !this.roleModel.isEnabled).subscribe(res => {

          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: `!Usuario ${messagePart} con éxito!`,
            showConfirmButton: false,
          });
          setTimeout(() => {
            Swal.close();
            this.router.navigate(['/users'])
              .then(() => {
                window.location.reload();
              });
          }, 1200);

        }, err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al eliminar asignación'
          });
        }
        );
      }
    })
  }

  onSubmit(form: FormGroup) {

    this.submitted = true;
    if (form.invalid) {
      return;
    }

    this.roleModel = { ...this.FormProfile.value };
    this.user.name = this.FormProfile.value.fullName;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.userService.patch(this.user, this.id).subscribe(res => {

      this.updateRoleUser();

      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text: '¡Datos modificados correctamente!',
        showConfirmButton: false,
        timer: 1000
      });

      setTimeout(() => {

        if (this.role === "admin") {
          this.getAdminData();
          return;
        }

        this.getUserDataById(this.id, this.role, this.services);

      }, 1200);

      this.submitted = false;
      this.modifyProfile();

    }, (err) => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al modificar sus datos'
      });

      this.submitted = false;
    });
  }

}
