import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReminderService } from '../../services/reminder.service';
import { Reminder } from '../../models/reminder';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MedicationService } from '../../services/medication.service';
import { BranchMedicationReminderService } from '../../services/branch-medication-reminder.service';
import { TutorService } from 'src/app/services/tutor.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {

  userReminders: Reminder[] = [];
  branchMedications: [] = [];
  reminderAction: string = 'reminderList';

  modifyId: string = '';

  FormReminder: FormGroup;
  submitted: boolean = false;
  medName: string = '';
  modifyGrammage: string = '';
  unit: string = '';
  units = [];
  frequencies = [];
  endingType: any;
  endingTypes = [
    {
      id: 1,
      description: "Sin fecha"
    },
    {
      id: 2,
      description: "Hasta"
    },
    {
      id: 3,
      description: "Cantidad de días"
    }
  ];
  isBranchMedication: boolean = false;
  branchMedicationId: string;
  pharmmacyName: string;

  constructor(
    private router: Router,
    private reminderService: ReminderService,
    private tutorService: TutorService,
    public formBuilder: FormBuilder,
    private medicationService: MedicationService,
    private branchMedicationReminderService: BranchMedicationReminderService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {

    localStorage.removeItem('userAction')
    localStorage.removeItem('patientData')
    this.tutorService.setUserAction('')

    this.FormReminder = this.formBuilder.group({
      medicationName: [
        '',
        [Validators.required, Validators.maxLength(55)]
      ],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      dose: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
      unit: ['', [Validators.required]],
      endingType: ['', [Validators.required]],
      daysAmount: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
      frequency: ['', [Validators.required]],
      timeNotification: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$')]],
      grammage: ['', [Validators.pattern('[0-9]{1,5}')]],
      inventory: ['', [Validators.pattern('[0-9]{1,5}')]],
      restockLimit: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]]
    });

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
      heightAuto: false
    });
    Swal.showLoading();
    this.getReminders();
    this.getUnits();
    this.getFrequencies();

    if (this.medicationService.getUserAction() == 'addReminder') {
      this.isBranchMedication = true;
      let medication = this.medicationService.getMedicationData();
      this.branchMedicationId = medication['id'];
      this.addReminder();
      this.patchMedicationValues(medication);
    }
  }

  addReminder() {
    this.reminderAction = 'newReminder';
    this.unit = '';
    this.FormReminder.controls['dose'].patchValue('1');
  }

  volver() {
    if (this.isBranchMedication && this.reminderAction == 'newReminder') {
      this.router.navigateByUrl('pharmacy/profile');
    }
    this.reminderAction = 'reminderList';
    this.submitted = false;
    this.FormReminder.reset();
    this.FormReminder.enable();
    this.endingType = 0;
    this.medicationService.setUserAction('');
    this.isBranchMedication = false;
  }

  getFrequencies() {
    this.reminderService.getFrequencies().subscribe(res => {
      this.frequencies = res['frequencies'];
    });
  }

  getUnits() {
    this.reminderService.getUnits().subscribe(res => {

      this.units = res['units'];

    }, (err) => {
      console.log(err.message);

      Swal.fire({
        icon: 'error',
        text: err.message,
        title: 'No hay conexión con el servidor.'
      });
      this.router.navigateByUrl('/');

    });
  }

  formatedDate(date, format) {
    return moment(date).format(format);
  }

  formatedHour(hour, format) {
    return moment(hour).utc().format(format);
  }

  getReminders() {

    this.reminderService.get().subscribe(res => {

      let format = "DD/MM/YYYY";
      let hour = "HH:mm";

      for (var i = 0; i < res['reminders'].length; i++) {
        res['reminders'][i]['startDate'] = this.formatedDate(res['reminders'][i]['startDate'], format);
        res['reminders'][i]['timeNotification'] = this.formatedHour(res['reminders'][i]['timeNotification'], hour);
        if (res['reminders'][i]['endDate']) {
          res['reminders'][i]['endDate'] = this.formatedDate(res['reminders'][i]['endDate'], format);
        }
      }

      this.userReminders = res['reminders'];
      this.getBranchMedications();

    }, (err) => {
      console.log(err.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al cargar sus medicamentos personales'
      });
    })
  }

  getBranchMedications() {
    this.branchMedicationReminderService.get().subscribe(res => {

      let format = "DD/MM/YYYY";
      let hour = "HH:mm";

      for (var i = 0; i < res['branchMedicationReminders'].length; i++) {
        res['branchMedicationReminders'][i]['startDate'] = this.formatedDate(res['branchMedicationReminders'][i]['startDate'], format);
        res['branchMedicationReminders'][i]['timeNotification'] = this.formatedHour(res['branchMedicationReminders'][i]['timeNotification'], hour);
        if (res['branchMedicationReminders'][i]['endDate']) {
          res['branchMedicationReminders'][i]['endDate'] = this.formatedDate(res['branchMedicationReminders'][i]['endDate'], format);
        }
      };

      this.branchMedications = res['branchMedicationReminders'];
      console.log(this.branchMedications);
      Swal.close();

    }, err => {
      console.log(err.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al cargar sus medicamentos de farmacia'
      });
    });
  }

  patchMedicationValues(medication) {
    this.FormReminder.patchValue({
      medicationName: medication['medicationName'],
      unit: medication['unit']
    });
    this.FormReminder.controls['medicationName'].disable();
    this.FormReminder.controls['unit'].disable();
    if (medication['grammage']) {
      this.FormReminder.controls['grammage'].setValue(medication['grammage']);
    }
    this.FormReminder.controls['grammage'].disable();
  }

  modifyReminder(reminder) {
    this.reminderAction = 'modifyReminder';
    this.submitted = false;

    if (reminder['branchMedication']) {
      this.isBranchMedication = true;

      this.setMedicationValues(reminder);

      this.FormReminder.controls['medicationName'].disable();
      this.FormReminder.controls['unit'].disable();
      this.FormReminder.controls['grammage'].disable();

      this.medName = reminder['branchMedication']['medicationName'];
      this.unit = reminder['branchMedication']['unit'];
      this.modifyGrammage = reminder['branchMedication']['grammage'];
    } else {
      this.setFormValues(reminder);

      this.medName = reminder['medicationName'];
      this.unit = reminder['unit'];
      this.modifyGrammage = reminder['grammage'];
    }

    this.modifyId = reminder['id'];
  }

  checkReminder(reminder) {

    if (reminder['branchMedication']) {
      this.isBranchMedication = true;

      this.setMedicationValues(reminder);

      this.medName = reminder['branchMedication']['medicationName'];
      this.unit = reminder['branchMedication']['unit'];
      this.modifyGrammage = reminder['branchMedication']['grammage'];
    } else {
      this.setFormValues(reminder);

      this.medName = reminder['medicationName'];
      this.unit = reminder['unit'];
      this.modifyGrammage = reminder['grammage'];
    }

    this.FormReminder.disable();

    this.reminderAction = 'checkReminder';
  }

  setMedicationValues(medication) {
    if (medication['endDate'] === null) {
      this.FormReminder.controls['endDate'].setValue(null);
      this.FormReminder.controls['endingType'].setValue(1);
      this.endingType = 1;
    } else if (medication['endDate'] !== null) {
      let endDate = moment(medication['endDate'], "DD/MM/YYYY");
      this.FormReminder.controls['endDate'].setValue(endDate);
      this.FormReminder.controls['endingType'].setValue(2);
      this.endingType = 2;
    }

    this.FormReminder.patchValue({
      dose: medication['dose'],
      startDate: moment(medication['startDate'], "DD/MM/YYYY"),
      frequency: medication['frequency'],
      medicationName: medication['branchMedication']['medicationName'],
      unit: medication['branchMedication']['unit'],
      timeNotification: medication['timeNotification'].replace(':', ''),
      inventory: medication['inventory'],
      grammage: medication['branchMedication']['grammage'],
      restockLimit: medication['restockLimit']
    });
  }

  setFormValues(reminder) {

    if (reminder['endDate'] === null) {
      this.FormReminder.controls['endDate'].setValue(null);
      this.FormReminder.controls['endingType'].setValue(1);
      this.endingType = 1;
    } else if (reminder['endDate'] !== null) {
      let endDate = moment(reminder['endDate'], "DD/MM/YYYY");
      this.FormReminder.controls['endDate'].setValue(endDate);
      this.FormReminder.controls['endingType'].setValue(2);
      this.endingType = 2;
    }

    this.FormReminder.patchValue({
      dose: reminder['dose'],
      startDate: moment(reminder['startDate'], "DD/MM/YYYY"),
      frequency: reminder['frequency'],
      medicationName: reminder['medicationName'],
      unit: reminder['unit'],
      timeNotification: reminder['timeNotification'].replace(':', ''),
      inventory: reminder['inventory'],
      grammage: reminder['grammage']
    });
  }

  deleteReminder(id) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "El medicamento se eliminará de forma permanente.",
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
          text: 'Espere por favor...'
        });
        Swal.showLoading();
        this.reminderService.delete(id).subscribe(res => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: '!Medicamento eliminado con éxito!',
            showConfirmButton: false,
          });

          setTimeout(() => {
            this.router.navigateByUrl('/reminder');
          }, 1500);

        }, (err) => {
          console.log(err.error.message);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al eliminar el medicamento'
          });
        }
        );
      }
    })
  }

  deleteBranchMedication(id) {
    Swal.fire({
      title: '¿Está seguro?',
      text: "El medicamento se eliminará de forma permanente.",
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
          text: 'Espere por favor...'
        });
        Swal.showLoading();
        this.branchMedicationReminderService.delete(id).subscribe(res => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: '!Medicamento eliminado con éxito!',
            showConfirmButton: false,
          });

          setTimeout(() => {
            this.router.navigateByUrl('/reminder');
          }, 1500);

        }, (err) => {
          console.log(err.error.message);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al eliminar el medicamento'
          });
        }
        );
      }
    })
  }

  onSubmit(form: FormGroup) {

    const format = "DD-MM-YYYY";
    const today = moment().toDate();

    if (this.FormReminder.value.endDate == null || this.FormReminder.value.endDate == '' && this.endingType != 2) {
      this.FormReminder.patchValue({ endDate: today });
    }
    if (this.FormReminder.value.daysAmount == '' || this.FormReminder.value.daysAmount == null && this.endingType != 3) {
      this.FormReminder.patchValue({ daysAmount: 1 })
    }

    if (!this.isBranchMedication) {
      this.FormReminder.patchValue({ restockLimit: 1 });
    }

    let reminder = { ...this.FormReminder.value };

    this.submitted = true;
    if (form.invalid) { return; }

    if (this.endingType == 1) {
      delete reminder.endDate;
    }
    else if (this.endingType == 2) {
      reminder['endDate'] = this.formatedDate(reminder['endDate'], format);
    }
    else if (this.endingType == 3) {
      reminder['endDate'] = moment(reminder['startDate']).add(reminder['daysAmount'], 'days').format(format)
    }
    delete reminder.daysAmount;
    delete reminder.endingType;

    if (reminder['grammage'] == '' || reminder['grammage'] == null) {
      delete reminder.grammage;
    }
    if (reminder['inventory'] == '' || reminder['inventory'] == null) {
      delete reminder.inventory;
    }
    if (!this.isBranchMedication) {
      delete reminder.restockLimit;
    }

    reminder['startDate'] = this.formatedDate(reminder['startDate'], format);
    reminder['timeNotification'] = reminder['timeNotification'].slice(0, 2) + ':' + reminder['timeNotification'].slice(2, 4);

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
      heightAuto: false
    });
    Swal.showLoading();

    if (this.reminderAction === 'newReminder') {

      if (this.isBranchMedication) {
        reminder.branchMedication = this.branchMedicationId;
        this.branchMedicationReminderService.post(reminder).subscribe(resp => {

          console.log(resp);
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: '¡Medicamento creado con éxito!',
            showConfirmButton: false,
          });

          this.submitted = false;
          this.medicationService.setUserAction('');
          this.medicationService.setMedicationData(null);

          setTimeout(() => {
            this.router.navigateByUrl('/reminder');
          }, 1500);

        }, err => {
          console.log(err.error.message);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al crear el medicamento'
          });
        });
      } else {
        this.reminderService.post(reminder)
          .subscribe(resp => {

            console.log(resp);
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              text: '¡Medicamento creado con éxito!',
              showConfirmButton: false,
            });

            setTimeout(() => {
              this.router.navigateByUrl('/reminder');
            }, 1500);

          }, (err) => {
            console.log(err.error.message);
            Swal.fire({
              icon: 'error',
              text: err.error.message,
              title: 'Error al crear el medicamento'
            });
          });
      }

    } else if (this.reminderAction === 'modifyReminder') {

      if (this.isBranchMedication) {
        this.branchMedicationReminderService.patch(this.modifyId, reminder).subscribe(res => {
          console.log(res);
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: '¡Medicamento modificado con éxito!',
            showConfirmButton: false,
          });

          setTimeout(() => {
            this.router.navigateByUrl('/reminder');
          }, 1500);
        }, err => {
          console.log(err.error.message);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al modificar el medicamento'
          });
        });

      } else {
        this.reminderService.patch(this.modifyId, reminder)
          .subscribe(resp => {

            console.log(resp);

            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              text: '¡Medicamento modificado con éxito!',
              showConfirmButton: false,
            });

            setTimeout(() => {
              this.router.navigateByUrl('/reminder');
            }, 1500);

          }, (err) => {

            console.log(err.error.message);
            Swal.fire({
              icon: 'error',
              text: err.error.message,
              title: 'Error al modificar el medicamento'
            });
          })
      }

    }

  }
}
