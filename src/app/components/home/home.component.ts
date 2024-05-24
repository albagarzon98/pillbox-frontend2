import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MedicationService } from '../../services/medication.service';
import { AppointmentService } from '../../services/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showDescMedicament: boolean = false;
  showDescPharmacy: boolean = false;
  showDescAppointment: boolean = false;
  showDescRequest: boolean = false;
  showDescPatients: boolean = false;
  showDescUsers: boolean = false;
  showDescReports: boolean = false;

  name: string;
  role: string;

  constructor(
    private authService: AuthService,
    private medicationService: MedicationService,
    private appointmentService: AppointmentService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.getNombre();
    this.setRole();
    this.medicationService.setUserAction('');
  }

  getNombre() {
    if (localStorage.getItem('name')) {
      this.name = localStorage.getItem('name');
    }
  }

  getGender() {
    if (localStorage.getItem('gender')) {
      return localStorage.getItem('gender');
    }
    return '';
  }

  getPathName() {
    return window.location.pathname;
  }

  setRole() {
    this.role = this.authService.getRole();
  }

  screenWidth() {
    return window.screen.width;
  }

  newAppointment() {
    this.appointmentService.setUserAction('newAppointment');

    localStorage.setItem('userAction', 'newAppointment');

    this.router.navigateByUrl('/appointment');
  }

}
