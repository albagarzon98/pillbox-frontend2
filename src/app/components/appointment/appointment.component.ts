import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Appointment } from '../../models/appointment';
import * as moment from 'moment';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  appointments: Appointment[] = [];
  byDate = [];
  
  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) {
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
      };
      this.router.onSameUrlNavigation = 'reload';
    }

  ngOnInit(): void {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.getAppointments();
  }

  route () {
    return this.router.url;
  }

  newAppointment () {
    this.appointmentService.setUserAction('newAppointment');
    this.router.navigateByUrl('/appointment/addAppointment');
  }
  
  orderByDate ( appointments ) {
    
    let format = 'DD/MM/YYYY';
    let hour = 'HH:mm';
    
    appointments.sort(function(a, b){
      a['reservationDate'] = new Date(a['reservationDate']);
      b['reservationDate'] = new Date(b['reservationDate']);
      return (a['reservationDate']) - (b['reservationDate']);
    });
    
    for (let i = 0; i < appointments.length; i++) {
      let dayName = moment(appointments[i]['reservationDate']).utc().locale('es').format('dddd');
      dayName = dayName.slice(0, 1).toUpperCase() + dayName.slice(1);

      let dateAppointment = moment(appointments[i]['reservationDate']).utc().format(format);
      appointments[i]['reservationDate'] = `${dayName} ${dateAppointment}`;
      appointments[i]['startTime'] = moment(appointments[i]['startTime']).utc().format(hour);
      appointments[i]['endTime'] = moment(appointments[i]['endTime']).utc().format(hour);
    }
    
    let dates = [];

    for (let i = 0; i < appointments.length; i++) {
      
      let date = appointments[i]['reservationDate'];

      if ( i == 0 ) {
        dates.push(date);
        let firstDate = {
          name: date,
          dayAppointments: [appointments[i]]
        }
        this.byDate.push(firstDate);
      }

      if ( i != 0 && dates.indexOf(date) == -1 ) {
        dates.push(date);
        let newDate = {
          name: date,
          dayAppointments: [appointments[i]]
        }
        this.byDate.push(newDate);
      } else if ( i != 0 && dates.indexOf(date) != -1 ) {
        let position = dates.indexOf(date);
        this.byDate[position]['dayAppointments'].push(appointments[i]);
      }
    }

    this.orderByHour(this.byDate);
  }

  orderByHour ( byDate ) {
    for(let i = 0; i < byDate.length; i++){
      byDate[i]['dayAppointments'].sort(function(a, b){
        return (a['startTime'].slice(0, 2) + a['startTime'].slice(3)) - (b['startTime'].slice(0, 2) + b['startTime'].slice(3));
      });
    }
  }

  getAppointments () {
    let branchId = this.authService.getBranchId();

    this.appointmentService.get(branchId).subscribe(res=>{

      this.appointments = res['reservation'];

      this.orderByDate(this.appointments);

      Swal.close();
    },err=>{
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al cargar los turnos'
      });
    })

  }

}
