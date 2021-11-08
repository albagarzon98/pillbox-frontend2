import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  appointments = [];
  
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

  getAppointments () {
    let branchId = this.authService.getBranchId();

    this.appointmentService.get(branchId).subscribe(res=>{
      
      this.appointments = res['reservation'];
      console.log(this.appointments);
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
