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

  constructor(
    private router: Router,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    this.FormAppointment = this.formBuilder.group({
      reservationDate: ['', [Validators.required]],
      startTime: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$')]],
      endTime: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$')]]
    });

    this.userAction = this.appointmentService.getUserAction();
  }

  onSubmit ( form: FormGroup ) {
    this.submitted = true;
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
    console.log(appointment);
    
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

}
