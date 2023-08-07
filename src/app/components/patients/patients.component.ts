import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReminderService } from '../../services/reminder.service';
import { Reminder } from '../../models/reminder';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MedicationService } from '../../services/medication.service';
import { BranchMedicationReminderService } from '../../services/branch-medication-reminder.service';
import { TutorService } from 'src/app/services/tutor.service';
import { AuthService } from 'src/app/services/auth.service';
import { Tutor } from 'src/app/models/tutor';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  patients:Patient[] = [];
  tutorAction:string = 'patientList';
  tutor: Tutor = new Tutor();
  userId: string = '';
  tutorId: string = '';

  FormPatient: FormGroup;
  submitted:boolean = false;
  email:string = '';
  userReminders:Reminder[] = [];
  branchMedications:[] = [];
  patient: Patient = new Patient();



  constructor(
    private router: Router,
    private patientService: PatientService,
    private tutorService: TutorService,
    private authService: AuthService,
    public formBuilder: FormBuilder,


    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };
      this.router.onSameUrlNavigation = 'reload';
     }

  ngOnInit(): void {

    this.FormPatient = this.formBuilder.group({
      email: [
        '',
        [Validators.required, Validators.email]
      ],
    });
    this.patients = [];
    this.userId = this.authService.getUserId();
    this.getAssignedPatients();
  }

  getAssignedPatients() {
    this.tutorService.get().subscribe(resp =>{
      
      this.tutor = resp['tutor']['0'];
      console.log('tutor',this.tutor);
      
      this.tutorService.getAssignedPatients(this.tutor.id).subscribe( res =>{              
              this.patients = res['patients'];
              console.log('patients', this.patients);

            }, (err) => {
              console.log(err.message);
              Swal.fire({
                icon: 'error',
                text: err.error.message,
                title: 'Error al cargar sus medicamentos personales'
              });
            })
    }, (err) => {
      console.log(err.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al cargar tutor'
      });
    })
   
  }

  addReminder (  ) {

  }

  assignPatient() {
    this.tutorAction = 'assignPatient';
  }

  onSubmit( form: FormGroup ) {
    
    let patient = { ...this.FormPatient.value };
    this.submitted = true;
    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();

    if (this.tutorAction === 'assignPatient') {
       
        this.tutorService.sendAssignedPatientEmail(patient).subscribe(resp=>{
          
          console.log(resp);
          Swal.fire({
            showCloseButton: true,
            allowOutsideClick: true,
            icon: 'success',
            text:'¡Solicitud de asignación enviada! Cuando el paciente acepte la solicitud, el mismo se listará en pacientes a cargo.',
            showConfirmButton: false,
          });
    
          this.submitted = false;
          
          setTimeout(()=>{
            this.router.navigateByUrl('/patients');
          },1500);
          
        },err=>{
          console.log(err.error.message);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al enviar solicitud'
          });
        });
      }
  }

  deletePatient(patient: Patient){
    Swal.fire({
      title: '¿Está seguro?',
      text: "La asignación del paciente a cargo se eliminará.",
      icon: 'warning',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      showCancelButton: true,
      reverseButtons: true

    }).then((result)=>{
      if(result.isConfirmed){
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text:'Espere por favor...'
        });
        Swal.showLoading();
    
        this.tutorService.deleteTutorPatient( patient, this.tutor.id).subscribe(  res=>{
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text:'!Asignación eliminada con éxito!',
            showConfirmButton: false,
          });
          setTimeout(()=>{
            Swal.close();
            this.router.navigateByUrl('/patients');
          },1200);

        }, err=>{
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

  viewPatientReminders(patient: Patient){   
    
      this.tutorAction='reminderList';
      this.patient = patient;
      
      this.tutorService.getUserReminders(patient).subscribe( res =>{
          console.log('res 1', res);
          
        let format = "DD/MM/YYYY";
        let hour = "HH:mm";
  
        for(var i = 0; i < res['patientReminders'].length; i++){
          res['patientReminders'][i]['startDate'] = this.formatedDate(res['patientReminders'][i]['startDate'],format);
          res['patientReminders'][i]['timeNotification'] = this.formatedHour(res['patientReminders'][i]['timeNotification'], hour);
          if(res['patientReminders'][i]['endDate']){
            res['patientReminders'][i]['endDate'] = this.formatedDate(res['patientReminders'][i]['endDate'],format);
          }
        }
  
        this.userReminders = res['patientReminders'];
        console.log('this userRem', this.userReminders);

        for(var i = 0; i < res['branchMedicationReminders'].length; i++){
          res['branchMedicationReminders'][i]['startDate'] = this.formatedDate(res['branchMedicationReminders'][i]['startDate'],format);
          res['branchMedicationReminders'][i]['timeNotification'] = this.formatedHour(res['branchMedicationReminders'][i]['timeNotification'], hour);
          if(res['branchMedicationReminders'][i]['endDate']){
            res['branchMedicationReminders'][i]['endDate'] = this.formatedDate(res['branchMedicationReminders'][i]['endDate'],format);
          }
        };
  
        this.branchMedications = res['branchMedicationReminders'];
        console.log('this branch med', this.branchMedications);

      }, (err) => {
        console.log(err.message);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al cargar sus medicamentos personales'
        });
      })
           
  }

    formatedDate(date, format) {
    return moment(date).format(format);
  }

  formatedHour (hour, format) {
    return moment(hour).utc().format(format);
  }


  volver() {
    if ( this.tutorAction == 'assignPatient' ) {
      this.router.navigateByUrl('patients');
    }
    this.tutorAction = 'patientList';
    this.submitted = false;
    this.FormPatient.reset();
    this.FormPatient.enable();
    //this.medicationService.setUserAction('');
  }

  infoAsignarPaciente () {
    Swal.fire({
      icon: 'info',
      html:
      `<div class="csv-info">
        <span>Para asignar un paciente a cargo primero debe darse de alta
        el usuario con rol paciente.</span><br><br>
        <span>Al dar click en "Enviar solicitud", el mismo recibirá un correo electrónico en el </span><br>
        <span>que se solicita la aceptación de la tutela.</span><br><br>
        <span>Una vez aceptada, el paciente se listará en la pantalla de "Pacientes a cargo".</span><br><br>
      </div>`
          })
  }

}
