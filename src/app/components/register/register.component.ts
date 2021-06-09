import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  Roles = [
    {Nombre: 'farmaceutico' },
    {Nombre: 'tutor' },
    {Nombre: 'paciente' }
  ];
  
  FormRegister: FormGroup;
  
  user: UserModel;
  rememberAccount = false;

  submitted = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    this.FormRegister = this.formBuilder.group({
      Name: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(55)]
      ],
      Email: [
        '',
        [Validators.required, Validators.email]
      ],
      Password: [
        '',
        [Validators.required, Validators.minLength(8), Validators.pattern("(?=.*[0-9])(?=.*[a-z])([a-z0-9]+)")]
      ],
      Role: ['', [Validators.required]],
      RememberAccount: [false]
    });
    
    this.user = new UserModel();
  }

  onSubmit( form: FormGroup ) {
    
    this.submitted = true;
    if ( form.invalid ) { return; }

    //Asignamos los valores del form al objeto user
    this.user.name = this.FormRegister.value['Name'];
    this.user.email = this.FormRegister.value['Email'];
    this.user.role = this.FormRegister.value['Role'];
    this.user.password = this.FormRegister.value['Password'];
        
    //Asignamos el valor del form a la variable rememberAccount
    this.rememberAccount = this.FormRegister.value['RememberAccount'];

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    
    this.auth.signIn(this.user)
    .subscribe( resp => {

      console.log(resp);
      Swal.close();

      if( this.rememberAccount ){
        localStorage.setItem('email', this.user.email);
      }

      this.router.navigateByUrl('/home');

    }, (err)=>{
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al autenticar'
      });
    });
  }

}
