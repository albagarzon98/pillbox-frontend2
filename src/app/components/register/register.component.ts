import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
        '', Validators.compose(
        [Validators.required, Validators.minLength(8),
        this.patternValidator(/\d/, { hasNumber: true }),
        this.patternValidator(/[a-z]/, { hasSmallCase: true })
        ])
      ],
      ConfirmPassword:[
        '', 
        [Validators.required]
      ],
      Role: ['', [Validators.required]],
      RememberAccount: [false]
    },
    {

      validator: this.passwordMatchValidator
    });
    
    this.user = new UserModel();
  }

  
  patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // Si el valor del campo del formulario está vacío devolver null
        return null;
      }
  
      // Comparar el valor del formulario contra la expresión regular ingresada como parámetro
      const valid = regex.test(control.value);
  
      // Si es verdadero se retorna que no hay error, sino se retorna error
      return valid ? null : error;
    };
  }

  //Función encargada de comparar las contraseñas
  passwordMatchValidator(control: AbstractControl) {
    
    const password: string = control.get('Password').value; // Obtener la contraseña del form
    const confirmPassword: string = control.get('ConfirmPassword').value; // Obtener "Confirmar constraseña" del form
    
    // Comparar si las ontraseñas coinciden
    if (password !== confirmPassword) {
      // Si no coinciden, setear el error en nuestro confirmPassword del form
      control.get('ConfirmPassword').setErrors({ NoPassswordMatch: true });
    }
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
