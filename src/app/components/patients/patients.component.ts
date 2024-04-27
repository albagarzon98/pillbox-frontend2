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

  patients: Patient[] = [];
  tutorAction: string = 'patientList';
  tutor: Tutor = new Tutor();
  userId: string = '';
  tutorId: string = '';

  FormPatient: FormGroup;
  submitted: boolean = false;
  email: string = '';
  userReminders: Reminder[] = [];
  branchMedications: [] = [];
  patient: Patient = new Patient();

  FormReminder: FormGroup;
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
  modifyId: string = '';


  constructor(
    private router: Router,
    private patientService: PatientService,
    private tutorService: TutorService,
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private reminderService: ReminderService,
    private medicationService: MedicationService,
    private branchMedicationReminderService: BranchMedicationReminderService,

  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
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

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
      heightAuto: false
    });

    Swal.showLoading();

    this.patients = [];
    this.patient = JSON.parse(localStorage.getItem('patientData'));
    this.userId = this.authService.getUserId();
    this.getAssignedPatients();
    this.getUnits();
    this.getFrequencies();


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

    if (this.tutorService.getUserAction() == 'assignBranchMedication') {

      this.isBranchMedication = true;
      let medication = this.medicationService.getMedicationData();
      this.branchMedicationId = medication['id'];
      this.addReminder();
      this.patchMedicationValues(medication);
    }
  }

  getAssignedPatients() {
    this.tutorService.get().subscribe(resp => {

      this.tutor = resp['tutor']['0'];
      console.log('tutor', this.tutor);

      this.tutorService.getAssignedPatients(this.tutor.id).subscribe(res => {
        this.patients = res['patients'];
        console.log('patients', this.patients);
        Swal.close();

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

  addReminder() {
    this.tutorAction = 'newReminder';
    this.unit = '';
    this.FormReminder.controls['dose'].patchValue('1');

    this.getUnits();
    this.getFrequencies();

    if (this.medicationService.getUserAction() == 'addReminder') {
      this.isBranchMedication = true;
      let medication = this.medicationService.getMedicationData();
      this.branchMedicationId = medication['id'];
      this.patchMedicationValues(medication);
    }
  }

  assignPatient() {
    this.tutorAction = 'assignPatient';
  }

  onSubmit(form: FormGroup) {
    //Caso asignacion de paciente a cargo
    if (this.tutorAction === 'assignPatient') {
      var patient = { ...this.FormPatient.value };

    }
    //Caso asigacion de medicamento o modificar medicamento
    if (this.tutorAction === 'newReminder' || this.tutorAction === 'modifyReminder') {
      var format = "DD-MM-YYYY";
      var today = moment().toDate();

      if (this.FormReminder.value.endDate == null || this.FormReminder.value.endDate == '' && this.endingType != 2) {
        this.FormReminder.patchValue({ endDate: today });
      }
      if (this.FormReminder.value.daysAmount == '' || this.FormReminder.value.daysAmount == null && this.endingType != 3) {
        this.FormReminder.patchValue({ daysAmount: 1 })
      }

      if (!this.isBranchMedication) {
        this.FormReminder.patchValue({ restockLimit: 1 });
      }

      var reminder = { ...this.FormReminder.value };
    }

    this.submitted = true;
    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
      heightAuto: false
    });
    Swal.showLoading();

    if (this.tutorAction === 'assignPatient') {
      this.tutorService.sendAssignedPatientEmail(patient).subscribe(resp => {

        Swal.fire({
          showCloseButton: true,
          allowOutsideClick: true,
          icon: 'success',
          text: '¡Solicitud de asignación enviada! Cuando el paciente acepte la solicitud, el mismo se listará en pacientes a cargo.',
          showConfirmButton: false,
        });

        this.submitted = false;

        setTimeout(() => {
          this.router.navigateByUrl('/patients');
        }, 5000);

      }, err => {
        console.log(err.error.message);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al enviar solicitud'
        });
      });
    }

    if (this.tutorAction === 'newReminder') {
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


      if (this.isBranchMedication) {
        reminder.branchMedication = this.branchMedicationId;
        this.tutorService.postBranchMedicationReminderOfPatient(reminder).subscribe(resp => {

          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: '¡Medicamento asignado con éxito!',
            showConfirmButton: false,
          });

          this.submitted = false;
          this.medicationService.setUserAction('');
          this.medicationService.setMedicationData(null);

          setTimeout(() => {
            Swal.close();
            this.viewPatientReminders(this.patient);
          }, 1500);

        }, err => {
          console.log(err.error.message);
          Swal.fire({
            icon: 'error',
            text: err.error.message,
            title: 'Error al asignar el medicamento'
          });
        });
      } else {

        this.tutorService.postUserReminder(reminder, this.patient)
          .subscribe(resp => {

            console.log(resp);
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              text: '¡Medicamento asignado con éxito!',
              showConfirmButton: false,
            });

            setTimeout(() => {
              //this.router.navigateByUrl('/patients');
              Swal.close();
              this.viewPatientReminders(this.patient);
            }, 1500);

          }, (err) => {
            console.log(err.error.message);
            Swal.fire({
              icon: 'error',
              text: err.error.message,
              title: 'Error al asignar el medicamento'
            });
          });
      }

    } else if (this.tutorAction === 'modifyReminder') {
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
            Swal.close();
            this.viewPatientReminders(this.patient);
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
              Swal.close();
              this.viewPatientReminders(this.patient);
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

  deletePatient(patient: Patient) {
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

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text: 'Espere por favor...'
        });
        Swal.showLoading();

        this.tutorService.deleteTutorPatient(patient, this.tutor.id).subscribe(res => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: '!Asignación eliminada con éxito!',
            showConfirmButton: false,
          });
          setTimeout(() => {
            Swal.close();
            this.router.navigateByUrl('/patients');
          }, 1200);

        }, err => {
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

  viewPatientReminders(patient: Patient) {

    this.tutorAction = 'reminderList';
    this.patient = patient;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.tutorService.getUserReminders(patient).subscribe(res => {
      console.log('res 1', res);

      let format = "DD/MM/YYYY";
      let hour = "HH:mm";

      for (var i = 0; i < res['patientReminders'].length; i++) {
        res['patientReminders'][i]['startDate'] = this.formatedDate(res['patientReminders'][i]['startDate'], format);
        res['patientReminders'][i]['timeNotification'] = this.formatedHour(res['patientReminders'][i]['timeNotification'], hour);
        if (res['patientReminders'][i]['endDate']) {
          res['patientReminders'][i]['endDate'] = this.formatedDate(res['patientReminders'][i]['endDate'], format);
        }
      }

      this.userReminders = res['patientReminders'];
      console.log('this userRem', this.userReminders);

      for (var i = 0; i < res['branchMedicationReminders'].length; i++) {
        res['branchMedicationReminders'][i]['startDate'] = this.formatedDate(res['branchMedicationReminders'][i]['startDate'], format);
        res['branchMedicationReminders'][i]['timeNotification'] = this.formatedHour(res['branchMedicationReminders'][i]['timeNotification'], hour);
        if (res['branchMedicationReminders'][i]['endDate']) {
          res['branchMedicationReminders'][i]['endDate'] = this.formatedDate(res['branchMedicationReminders'][i]['endDate'], format);
        }
      };

      this.branchMedications = res['branchMedicationReminders'];
      console.log('this branch med', this.branchMedications);
      Swal.close();
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

  formatedHour(hour, format) {
    return moment(hour).utc().format(format);
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

  getFrequencies() {
    this.reminderService.getFrequencies().subscribe(res => {
      this.frequencies = res['frequencies'];
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
    this.tutorAction = 'modifyReminder';
    this.submitted = false;
    console.log('tutor Action', reminder);

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

    this.tutorAction = 'checkReminder';
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
            Swal.close();
            this.viewPatientReminders(this.patient);
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
            Swal.close();
            this.viewPatientReminders(this.patient);
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

  addBranchMedicationReminder() {

    this.tutorService.setUserAction('assignBranchMedication');
    this.tutorService.setPatientData(this.patient);

    localStorage.setItem('userAction', 'assignBranchMedication');
    localStorage.setItem('patientData', JSON.stringify(this.patient));

    this.router.navigateByUrl('/pharmacy');
  }

  volver() {
    if (this.tutorAction == 'assignPatient') {
      this.router.navigateByUrl('patients');
    }
    if (this.isBranchMedication && this.tutorAction == 'newReminder') {
      this.router.navigateByUrl('pharmacy/profile');
    }
    this.tutorAction = 'reminderList';
    this.viewPatientReminders(this.patient);

    this.submitted = false;
    this.FormPatient.reset();
    this.FormPatient.enable();
    //this.medicationService.setUserAction('');

    this.FormReminder.reset();
    this.FormReminder.enable();
    this.endingType = 0;
    this.medicationService.setUserAction('');
    this.isBranchMedication = false;
  }

  infoAsignarPaciente() {
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
