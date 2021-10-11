import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  FormRegister: FormGroup;
  
  user: UserModel = new UserModel();
  patient: Patient = new Patient();

  rememberAccount: boolean = false;
  submitted: boolean = false;
  registerAction: string = 'roleSelect';

  roles: string[] = [];
  genders = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private patientService: PatientService,
    private roleService: RoleService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    if ( localStorage.getItem('token') ) {
      this.router.navigateByUrl('/home');
    }
    
    this.FormRegister = this.formBuilder.group({
      Name: [
        '',
        [Validators.required, Validators.maxLength(55)]
      ],
      LastName: [
        '',
        [Validators.required, Validators.maxLength(55)]
      ],
      Phone: ['', [Validators.required, Validators.pattern('[0-9]{10,11}')]],
      Email: [
        '',
        [Validators.required, Validators.email]
      ],
      Document: [null, [Validators.required, Validators.pattern('[0-9]{7,8}')]],
      Gender: ['', [Validators.required]],
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
      PharmacyCode: [null, [Validators.required, Validators.pattern('[a-z0-9]{11}')]],
      RememberAccount: [false]
    },
    {
      validator: this.passwordMatchValidator
    });
    
    this.getRoles();
    this.getGenders();
  }

  
  //Obtener los roles de la BD
  getRoles () {
    this.roleService.get().subscribe( res =>{
      
      console.log(res);

      for (var i = 0; i < res['roles'].length; i++) {
        const descripcion: string = res['roles'][i]['descripcion'];
        this.roles.push(descripcion);
      }
    }, (err) => {
      console.log(err.message);

      Swal.fire({
        icon: 'error',
        text: err.message,
        title: 'No hay conexión con el servidor.'
      });
      this.router.navigateByUrl('/');

    })
  }

  getGenders() {
    this.patientService.getGenders().subscribe( res => {
      this.genders = res['genders'];
    });
  }

  //Validador de patrones
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

  //Esta función se ejecuta si el usuario selecciona el rol paciente
  selectRolePatient () {
    this.registerAction = 'inputData';
    this.user.role = this.roles[2];
    console.log(`el rol del usuario es: ${this.user.role}`);
  }

  //Esta función se ejecuta si el usuario selecciona el rol tutor
  selectRoleTutor () {
    this.registerAction = 'inputData';
    this.user.role = this.roles[3];
    console.log(`el rol del usuario es: ${this.user.role}`);
  }

  //Esta función se ejecuta si el usuario selecciona el rol farmacéutico
  selectRolePharmaceutic () {
    this.registerAction = 'inputData';
    this.user.role = this.roles[1];
    console.log(`el rol del usuario es: ${this.user.role}`);
  }

  volver () {
    this.registerAction = 'roleSelect';
    this.FormRegister.reset();
    this.submitted = false;
  }

  onSubmit( form: FormGroup ) {
    
    this.submitted = true;
    if ( form.invalid ) { return; }

    //Asignamos los valores del form al objeto user
    this.user.name = this.FormRegister.value['Name'];
    this.user.email = this.FormRegister.value['Email'];
    this.user.password = this.FormRegister.value['Password'];
    if ( this.FormRegister.value['PharmacyCode'] ) {
      this.user.pharmacyCode = this.FormRegister.value['PharmacyCode'];
    }

    //Asignamos los valores del form al objeto patient
    this.patient.fullName = `${this.FormRegister.value['Name']} ${this.FormRegister.value['LastName']}`;
    this.patient.email = this.FormRegister.value['Email'];
    this.patient.document = this.FormRegister.value['Document'];
    this.patient.gender = this.FormRegister.value['Gender'];
    this.patient.phoneNumber = this.FormRegister.value['Phone'];
        
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

      this.patientService.post( this.patient ).subscribe( res => {
        console.log(res);

      }, (err) => {
        console.log(err);
      });
      Swal.close();

      //Si el usuario marcó el check "Recordar cuenta" se almacena su email
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
