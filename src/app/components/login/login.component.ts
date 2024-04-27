import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PharmacistService } from 'src/app/services/pharmacist.service';
import { TutorService } from 'src/app/services/tutor.service';
import Swal from 'sweetalert2';
import { UserModel } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  FormLogin: FormGroup;

  //Este booleano representa el valor del check "Recordar cuenta"
  rememberAccount = false;

  //Este booleano me sirve para mostrar las validaciones de los campos del form solo si el
  //form está submitted
  submitted = false;

  user: UserModel = new UserModel();
  role = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private patientService: PatientService,
    private pharmacistService: PharmacistService,
    private tutorService: TutorService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/home');
    }

    //Se inicializan las variables de control del formulario, con sus validadores
    this.FormLogin = this.formBuilder.group({
      Email: [
        '',
        [Validators.required]
      ],
      Password: [
        '',
        [Validators.required]
      ],
      RememberAccount: [false]
    });

    //Si se encuentra almacenada una cuenta de email en el localStorage, se asigna ese mail al usuario,
    //se setea el check "Recordar cuenta" en true, y se muestran estos valores en el form
    if (localStorage.getItem('email')) {
      this.user.email = localStorage.getItem('email');
      this.rememberAccount = true;
      this.FormLogin.patchValue({ RememberAccount: this.rememberAccount });
      this.FormLogin.patchValue({ Email: this.user.email });
    }
  }

  login(form: FormGroup) {

    this.submitted = true;
    if (form.invalid) { return; }

    //Asignamos los valores del form al objeto user
    this.user.email = this.FormLogin.value['Email'];
    this.user.password = this.FormLogin.value['Password'];

    //Asignamos el valor del check "Recordar cuenta" a la variable rememberAccount
    this.rememberAccount = this.FormLogin.value['RememberAccount'];

    //Alerta de SweetAlert
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
      heightAuto: false
    });
    Swal.showLoading();

    //Se llama al login del servicio
    this.auth.login(this.user)
      .subscribe(resp => {

        console.log(resp);
        this.role = this.auth.getRole();

        if (this.role == 'paciente') {
          this.patientService.get().subscribe(res => {
            localStorage.setItem('gender', res['patient']['0']['gender']);
            localStorage.setItem('fullName', res['patient']['0']['fullName']);
          });
        } else if (this.role == 'farmaceutico') {
          this.pharmacistService.get().subscribe(res => {
            localStorage.setItem('gender', res['pharmacist']['0']['gender']);
            localStorage.setItem('fullName', res['pharmacist']['0']['fullName']);
          });

        } else if (this.role == 'tutor') {
          this.tutorService.get().subscribe(res => {
            localStorage.setItem('gender', res['tutor']['0']['gender']);
            localStorage.setItem('fullName', res['tutor']['0']['fullName']);
          });

        }

        //Se cierra el Loading...
        Swal.close();

        //Si el usuario seleccionó el check "Recordar mi cuenta", se almacena su email en el localStorage
        if (this.rememberAccount) {
          localStorage.setItem('email', this.user.email);
        }

        //Si el login se realiza de manera correcta, redirige al usuario a /home
        this.router.navigateByUrl('/home');

      }, (err) => {

        console.log(err.error.message);
        //Se muestra el error en un alert
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al autenticar'
        });
      });

  }

}
