import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Appointment } from '../../../models/appointment';
import { AppointmentService } from '../../../services/appointment.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {

  submitted: boolean = false;
  FormAppointment: FormGroup;
  userAction: string;
  appointment: Appointment;
  statusTranslations: { [key: string]: string } = {
    taken: 'Reservado',
    active: 'Activo',
    inactive: 'Inactivo',
    rejected: 'Rechazado'
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    this.FormAppointment = this.formBuilder.group({
      reservationDate: ['', [Validators.required]],
      startTime: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3])(:?[0-5][0-9])?$')]],
      endTime: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3])(:?[0-5][0-9])?$')]],
      assignedUser: [''],
      branchName: [''],
      pharmacistUser: [''],
      status: ['']
    });

    const userAction = localStorage.getItem('userAction');
    const appointmentData = JSON.parse(localStorage.getItem('appointmentData'));
    
    this.appointmentService.setUserAction(userAction);
    this.appointmentService.setAppointmentData(appointmentData);

    this.userAction = this.appointmentService.getUserAction();
    this.appointment = this.appointmentService.getAppointmentData();

    this.setFormValues();

    if(this.userAction == 'newAppointment' || this.userAction == 'modifyAppointment'){

      this.FormAppointment.removeControl('assignedUser');
      this.FormAppointment.removeControl('branchName');
      this.FormAppointment.removeControl('pharmacistUser');
      this.FormAppointment.removeControl('status');
    
    }

  }

  setFormValues () {
    if ( this.userAction != 'newAppointment' ) {

      this.FormAppointment.patchValue({
          reservationDate: moment(this.appointment.reservationDate, 'DD/MM/YYYY').toDate(),
          startTime: this.appointment.startTime,
          endTime: this.appointment.endTime,
          assignedUser: this.appointment.assignedUser?.name,
          branchName: this.appointment.branchName,
          pharmacistUser: this.appointment.pharmacistUser.name,
          status: this.getStatusTranslation(this.appointment.status),

      });
    };
    if ( this.userAction == 'detailsAppointment' ) {
      this.FormAppointment.disable();
    }
  }

  getStatusTranslation(status: string): string {        
    return this.statusTranslations[status] || status;
  }

  onSubmit ( form: FormGroup ) {
    this.submitted = true;
    if ( this.userAction == 'modifyAppointment' ) { 
      this.FormAppointment.patchValue({
        startTime: this.FormAppointment.value.startTime.replace(':', ''),
        endTime: this.FormAppointment.value.endTime.replace(':', '')
      });
      
    }

    if ( form.invalid ) {
      return;
    }

    let format = 'DD-MM-YYYY';
    let branchId = this.authService.getBranchId();

    let appointment = {...this.FormAppointment.value};
    appointment.branchId = branchId;

    appointment['reservationDate'] = moment(appointment['reservationDate']).format(format);
    appointment['startTime'] = appointment['startTime'].slice(0,2) + ':' + appointment['startTime'].slice(2,4);
    appointment['endTime'] = appointment['endTime'].slice(0,2) + ':' + appointment['endTime'].slice(2,4);

    if ( this.userAction == 'newAppointment' ) { 
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text:'Espere por favor...'
      });
      Swal.showLoading();
      this.appointmentService.post( appointment ).subscribe(res=>{
        
        console.log(res);
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text:'¡Turno creado con éxito!',
          showConfirmButton: false
        });
        setTimeout(()=>{
          this.router.navigateByUrl('/appointment');
        },1200);
  
      },err=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al crear el turno'
        });
      })
    }

    if ( this.userAction == 'modifyAppointment' ) { 
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text:'Espere por favor...'
      });
      Swal.showLoading();
      this.appointmentService.patch( this.appointment.id, appointment).subscribe(res=>{
        
        console.log(res);
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text:'¡Turno editado con éxito!',
          showConfirmButton: false
        });
        setTimeout(()=>{
          this.volver();
        },1200);
  
      },err=>{
        console.log(err);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al editar el turno'
        });
      })
    }


  }

  volver() {
    this.appointmentService.setUserAction('newAppointment');
    localStorage.setItem('userAction', 'newAppointment');

    this.router.navigateByUrl('/appointment');

  }

}
