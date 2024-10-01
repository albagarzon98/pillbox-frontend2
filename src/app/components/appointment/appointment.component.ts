import { Component, Inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Appointment } from '../../models/appointment';
import * as moment from 'moment';
import { loader } from 'src/app/utils/swalUtils';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BranchService } from 'src/app/services/branch.service';
import { IdNameStructure } from 'src/app/const/genericTypes';
import { formatBranchMedications } from 'src/app/utils/appointmentUtils';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface DialogData {
  branchMedications: IdNameStructure[];
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  appointments: Appointment[] = [];
  selectedAppointment: Appointment;
  byDate = [];
  userAction: string;
  role: string;
  availableAppointments: Appointment[] = [];
  upcomingAppointments: Appointment[] = [];
  availableByDate: any[] = [];
  upcomingByDate: any[] = [];
  selectedMedications: IdNameStructure[] = [];
  branchMedications: IdNameStructure[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private branchService: BranchService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {

    this.setRole();

    const userAction = localStorage.getItem('userAction');
    const branchData = JSON.parse(localStorage.getItem('branchData'));

    this.appointmentService.setUserAction(userAction);
    this.appointmentService.setBranchData(branchData);

    this.userAction = this.appointmentService.getUserAction();

    loader();
    this.branchMedications = formatBranchMedications(this.branchService.branchMedications);
    this.getAppointments();
  }

  setRole() {
    this.role = this.authService.getRole();
  }


  route() {
    return this.router.url;
  }

  newAppointment() {
    this.appointmentService.setUserAction('newAppointment');
    this.router.navigateByUrl('/appointment/addAppointment');
  }

  orderByDate(appointments) {

    let format = 'DD/MM/YYYY';
    let hour = 'HH:mm';

    this.availableAppointments = [];
    this.upcomingAppointments = [];


    appointments.sort(function (a, b) {
      a['reservationDate'] = new Date(a['reservationDate']);
      b['reservationDate'] = new Date(b['reservationDate']);
      return (a['reservationDate']) - (b['reservationDate']);
    });

    for (let i = 0; i < appointments.length; i++) {
      let dayName = moment(appointments[i]['reservationDate']).utcOffset(-3).locale('es').format('dddd');
      dayName = dayName.slice(0, 1).toUpperCase() + dayName.slice(1);

      let dateAppointment = moment(appointments[i]['reservationDate']).utcOffset(-3).format(format);
      appointments[i]['reservationDate'] = `${dayName} ${dateAppointment}`;
      appointments[i]['startTime'] = moment(appointments[i]['startTime']).utcOffset(-3).format(hour);
      appointments[i]['endTime'] = moment(appointments[i]['endTime']).utcOffset(-3).format(hour);

      if (appointments[i].status === 'active') {
        this.availableAppointments.push(appointments[i]);
      } else if (appointments[i].status === 'taken' && this.role == "farmaceutico") {
        this.upcomingAppointments.push(appointments[i]);

      } else if (appointments[i].status === 'taken' && appointments[i].assignedUser.id == this.authService.getUserId()) {
        this.upcomingAppointments.push(appointments[i]);
      }

      this.availableByDate = this.groupByDate(this.availableAppointments);
      this.upcomingByDate = this.groupByDate(this.upcomingAppointments);
    }

    let dates = [];

    for (let i = 0; i < appointments.length; i++) {

      let date = appointments[i]['reservationDate'];

      if (i == 0) {
        dates.push(date);
        let firstDate = {
          name: date,
          dayAppointments: [appointments[i]]
        }
        this.byDate.push(firstDate);
      }

      if (i != 0 && dates.indexOf(date) == -1) {
        dates.push(date);
        let newDate = {
          name: date,
          dayAppointments: [appointments[i]]
        }
        this.byDate.push(newDate);
      } else if (i != 0 && dates.indexOf(date) != -1) {
        let position = dates.indexOf(date);
        this.byDate[position]['dayAppointments'].push(appointments[i]);
      }
    }

    this.orderByHour(this.byDate);
  }

  orderByHour(byDate) {
    for (let i = 0; i < byDate.length; i++) {
      byDate[i]['dayAppointments'].sort(function (a, b) {
        return (a['startTime'].slice(0, 2) + a['startTime'].slice(3)) - (b['startTime'].slice(0, 2) + b['startTime'].slice(3));
      });
    }
  }

  groupByDate(appointments) {
    const byDate = [];

    for (let i = 0; i < appointments.length; i++) {
      const date = appointments[i].reservationDate;

      const existingDate = byDate.find((item) => item.name === date);

      if (existingDate) {
        existingDate.dayAppointments.push(appointments[i]);
      } else {
        byDate.push({
          name: date,
          dayAppointments: [appointments[i]],
        });
      }
    }
    this.orderByHour(byDate);

    return byDate;
  }

  getAppointments() {
    let branchId;
    let status = "";

    if (this.appointmentService.getUserAction() === 'takeAppointment') {
      branchId = this.appointmentService.branchData.branchId;
    } else {
      branchId = this.authService.getBranchId();
    }

    this.appointmentService.get(branchId, status).subscribe(res => {

      this.appointments = res['reservation'];

      this.orderByDate(this.appointments);
      Swal.close();
    }, err => {
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al cargar los turnos'
      });
    })
  }

  selectAppointment(appointment) {
    let appointmentId = appointment.id;
    Swal.fire({
      title: 'Confirmar Turno',
      text: "Usted esta solicitando un turno para el dia: " + appointment.reservationDate + " en la siguiente franja horaria: " + appointment.startTime + " a " + appointment.endTime,
      icon: 'warning',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      showCancelButton: true,
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...',
          showCancelButton: true,
          showConfirmButton: false,
        });
        Swal.showLoading();
        this.appointmentService.takeAppointment(appointmentId).subscribe(res => {
          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: true,
            icon: 'success',
            text: '!Turno solicitado con éxito! Recibirá un correo con la información del mismo',
            showConfirmButton: false,
          }).finally(() => {
            this.router.navigateByUrl('/appointment', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/appointment']);
            });
          });

        }, (err) => {
          console.log(err.error.message);
          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: true,
            icon: 'error',
            text: err.error.message,
            title: 'Error al solicitar el turno'
          });
        }
        );
      }
    })
  }

  viewDetails(appointment: Appointment) {

    this.appointmentService.setUserAction('detailsAppointment');
    this.appointmentService.setAppointmentData(appointment);

    localStorage.setItem('userAction', 'detailsAppointment');
    localStorage.setItem('appointmentData', JSON.stringify(appointment));

    this.router.navigateByUrl('/appointment/addAppointment')
  }

  rejectAppointment(appointment: Appointment) {
    let appointmentId = appointment.id;
    Swal.fire({
      title: 'Rechazar Turno',
      text: "Usted está por rechazar el turno para el día: " + appointment.reservationDate + " horario: " + appointment.startTime + " a " + appointment.endTime,
      icon: 'warning',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      showCancelButton: true,
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...',
          showCancelButton: true,
          showConfirmButton: false,
        });
        Swal.showLoading();
        this.appointmentService.rejectAppointment(appointmentId).subscribe(res => {
          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: true,
            icon: 'success',
            text: '!Turno rechazado! El usuario solicitante recibirá un correo con la información de rechazo.',
            showConfirmButton: false,
          }).finally(() => {
            this.router.navigateByUrl('/appointment', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/appointment']);
            });
          });

        }, (err) => {
          console.log(err.error.message);
          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: true,
            icon: 'error',
            text: err.error.message,
            title: 'Error al rechazar el turno'
          });
        }
        );
      }
    })
  }

  rejectAppointmentPatient(appointment: Appointment) {
    let appointmentId = appointment.id;
    Swal.fire({
      title: 'Rechazar Turno',
      text: "Usted está por rechazar el turno para el día: " + appointment.reservationDate + " horario: " + appointment.startTime + " a " + appointment.endTime,
      icon: 'warning',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      showCancelButton: true,
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...',
          showCancelButton: true,
          showConfirmButton: false,
        });
        Swal.showLoading();
        this.appointmentService.rejectPatientAppointment(appointmentId).subscribe(res => {
          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: true,
            icon: 'success',
            text: '!Turno cancelado! Recibirás un correo con la confirmación.',
            showConfirmButton: false,
          }).finally(() => {
            this.router.navigateByUrl('/appointment', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/appointment']);
            });
          });
        }, (err) => {
          console.log(err.error.message);
          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: true,
            icon: 'error',
            text: err.error.message,
            title: 'Error al rechazar el turno'
          });
        }
        );
      }
    })
  }

  modifyAppointment(appointment: Appointment) {

    this.appointmentService.setUserAction('modifyAppointment');
    this.appointmentService.setAppointmentData(appointment);

    localStorage.setItem('userAction', 'modifyAppointment');
    localStorage.setItem('appointmentData', JSON.stringify(appointment));

    this.router.navigateByUrl('/appointment/addAppointment')
  }

  deleteAppointment(appointment: Appointment) {
    let appointmentId = appointment.id;
    Swal.fire({
      title: 'Eliminar Turno',
      text: "Usted está por eliminar el turno para el día: " + appointment.reservationDate + " horario: " + appointment.startTime + " a " + appointment.endTime,
      icon: 'warning',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      showCancelButton: true,
      reverseButtons: true

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...',
          showCancelButton: true,
          showConfirmButton: false,
        });
        Swal.showLoading();
        this.appointmentService.delete(appointmentId).subscribe(res => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: '!Turno Eliminado!',
            showConfirmButton: false,
          })
          setTimeout(() => {
            this.router.navigateByUrl('/appointment');
          }, 1500);

        }, (err) => {
          console.log(err.error.message);
          Swal.fire({
            allowOutsideClick: false,
            showCloseButton: true,
            icon: 'error',
            text: err.error.message,
            title: 'Error al eliminar el turno'
          });
        }
        );
      }
    })
  }


  getTimeRemaining(appointment: Appointment): string {
    const appointmentDateTime = moment(
      `${appointment.reservationDate} ${appointment.startTime}`,
      'DD/MM/YYYY HH:mm'
    );
    const now = moment();
    const diff = appointmentDateTime.diff(now);
    moment.locale('es');

    if (diff < 0) {
      return 'Tiempo transcurrido';
    } else {
      const duration = moment.duration(diff);
      return `En ${duration.humanize()}`;
    }
  }

  openDialog(appointment): void {
    const dialogRef = this.dialog.open(AppointmentDialog, {
      width: '400px',
      data: {
        branchMedications: this.branchMedications
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.selectedMedications = result;
      console.log("SELECTED!!!", this.selectedMedications);
    });
  }
}

@Component({
  selector: 'appointment-dialog',
  templateUrl: 'appointment-dialog.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentDialog implements OnInit {

  myControl = new FormControl();
  filteredOptions: Observable<IdNameStructure[]>;
  selectedMedications: IdNameStructure[] = [];

  constructor(
    public dialogRef: MatDialogRef<AppointmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): IdNameStructure[] {
    const filterValue = value.toLowerCase();

    if (!value) {
      return this.data.branchMedications;
    }

    return this.data.branchMedications.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDeleteMedication(medication: IdNameStructure) {
    this.selectedMedications = this.selectedMedications.filter(med => med !== medication);
  }

  displayFn(option: IdNameStructure): string {
    return option && option.name ? option.name : '';
  }

  onSubmit() {
    const selectedOption = this.myControl.value;
    const exist = this.data.branchMedications.includes(selectedOption);
    const existInArray = this.selectedMedications.includes(selectedOption);

    if (selectedOption && !existInArray && exist) {
      this.selectedMedications.push(selectedOption);
    }
    this.myControl.reset();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }
}