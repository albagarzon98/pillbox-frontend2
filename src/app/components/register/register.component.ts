import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient';
import { Pharmacist } from 'src/app/models/pharmacist';
import { Tutor } from 'src/app/models/tutor';
import { PharmacistService } from 'src/app/services/pharmacist.service';
import { TutorService } from 'src/app/services/tutor.service';
import { loader } from 'src/app/utils/swalUtils';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  FormRegister: FormGroup;

  user: UserModel = new UserModel();
  patient: Patient = new Patient();
  pharmacist: Pharmacist = new Pharmacist();
  tutor: Tutor = new Tutor();

  rememberAccount: boolean = false;
  submitted: boolean = false;
  registerAction: string = 'roleSelect';

  roles: string[] = [];
  genders = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private patientService: PatientService,
    private pharmacistService: PharmacistService,
    private tutorService: TutorService,
    private roleService: RoleService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('token')) {
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
      ConfirmPassword: [
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
  getRoles() {
    this.roleService.get().subscribe(res => {

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
    this.patientService.getGenders().subscribe(res => {
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
  selectRolePatient() {
    this.registerAction = 'inputData';
    this.user.role = this.roles[2];
    console.log(`el rol del usuario es: ${this.user.role}`);
  }

  //Esta función se ejecuta si el usuario selecciona el rol tutor
  selectRoleTutor() {
    this.registerAction = 'inputData';
    this.user.role = this.roles[3];
    console.log(`el rol del usuario es: ${this.user.role}`);
  }

  //Esta función se ejecuta si el usuario selecciona el rol farmacéutico
  selectRolePharmaceutic() {
    this.registerAction = 'inputData';
    this.user.role = this.roles[1];
    console.log(`el rol del usuario es: ${this.user.role}`);
  }

  volver() {
    this.registerAction = 'roleSelect';
    this.FormRegister.reset();
    this.submitted = false;
  }

  onSubmit(form: FormGroup) {

    this.submitted = true;
    if (this.user.role == "farmaceutico" && form.invalid) { return; }
    if (this.user.role != 'farmaceutico' &&
      (this.FormRegister.controls.Name.invalid ||
        this.FormRegister.controls.LastName.invalid ||
        this.FormRegister.controls.Email.invalid ||
        this.FormRegister.controls.Phone.invalid ||
        this.FormRegister.controls.Document.invalid ||
        this.FormRegister.controls.Gender.invalid ||
        this.FormRegister.controls.Password.invalid ||
        this.FormRegister.controls.ConfirmPassword.invalid)) {
      return;
    }

    //Asignamos los valores del form al objeto user
    this.user.name = this.FormRegister.value['Name'];
    this.user.email = this.FormRegister.value['Email'];
    this.user.password = this.FormRegister.value['Password'];
    if (this.FormRegister.value['PharmacyCode']) {
      this.user.pharmacyCode = this.FormRegister.value['PharmacyCode'];
    }

    if (this.user.role == 'paciente') {

      //Asignamos los valores del form al objeto patient
      this.patient.fullName = `${this.FormRegister.value['Name']} ${this.FormRegister.value['LastName']}`;
      this.patient.email = this.FormRegister.value['Email'];
      this.patient.document = this.FormRegister.value['Document'];
      this.patient.gender = this.FormRegister.value['Gender'];
      this.patient.phoneNumber = this.FormRegister.value['Phone'];
    } else if (this.user.role == 'farmaceutico') {

      //Asignamos los valores del form al objeto farmaceutico
      this.pharmacist.fullName = `${this.FormRegister.value['Name']} ${this.FormRegister.value['LastName']}`;
      this.pharmacist.email = this.FormRegister.value['Email'];
      this.pharmacist.document = this.FormRegister.value['Document'];
      this.pharmacist.gender = this.FormRegister.value['Gender'];
      this.pharmacist.phoneNumber = this.FormRegister.value['Phone'];
    } else if (this.user.role == 'tutor') {

      //Asignamos los valores del form al objeto tutor
      this.tutor.fullName = `${this.FormRegister.value['Name']} ${this.FormRegister.value['LastName']}`;
      this.tutor.email = this.FormRegister.value['Email'];
      this.tutor.document = this.FormRegister.value['Document'];
      this.tutor.gender = this.FormRegister.value['Gender'];
      this.tutor.phoneNumber = this.FormRegister.value['Phone'];
    }

    //Asignamos el valor del form a la variable rememberAccount
    this.rememberAccount = this.FormRegister.value['RememberAccount'];

    loader();

    this.auth.signIn(this.user)
      .subscribe(resp => {
        console.log(resp);

        if (this.user.role == 'paciente') {
          this.patientService.post(this.patient).subscribe(res => {
            console.log(res);
          }, (err) => {
            console.log(err);
          });

        } else if (this.user.role == 'farmaceutico') {
          this.pharmacistService.post(this.pharmacist).subscribe(res => {
            console.log(res);

          }, (err) => {
            console.log(err);
          });
        } else if (this.user.role == 'tutor') {
          this.tutorService.post(this.tutor).subscribe(res => {
            console.log(res);

          }, (err) => {
            console.log(err);
          });
        }


        Swal.close();

        //Si el usuario marcó el check "Recordar cuenta" se almacena su email
        if (this.rememberAccount) {
          localStorage.setItem('email', this.user.email);
        }

        this.router.navigateByUrl('/home');

      }, (err) => {
        console.log(err.error.message);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al autenticar'
        });
      });
  }

}
