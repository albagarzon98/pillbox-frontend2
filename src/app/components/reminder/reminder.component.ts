import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReminderService } from '../../services/reminder.service';
import { Reminder } from '../../models/reminder';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MedicationService } from '../../services/medication.service';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {
    
  userReminders:Reminder[] = [];
  reminderAction:string = 'reminderList';

  modifyId: string = '';
  
  FormReminder: FormGroup;
  submitted = false;
  medName:string = '';
  modifyGrammage:string='';
  unit:string = '';
  // grammage: boolean;
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
  
  constructor(
    private router: Router,
    private reminderService: ReminderService,
    public formBuilder: FormBuilder,
    private medicationService: MedicationService
  ) { }

  ngOnInit(): void {
    
    this.FormReminder = this.formBuilder.group({
      medicationName: [
        '',
        [Validators.required, Validators.maxLength(55)]
      ],
      startDate: ['' , [Validators.required]],
      endDate: ['', [Validators.required]],
      dose: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
      unit: ['', [Validators.required] ],
      endingType: ['', [Validators.required]],
      daysAmount: ['', [Validators.required, Validators.pattern('[0-9]{1,5}')]],
      frequency: ['', [Validators.required] ],
      timeNotification: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$')]],
      grammage: ['', [Validators.pattern('[0-9]{1,5}')]],
      inventory: ['', [Validators.pattern('[0-9]{1,5}')]]
    });
    
    this.getUnits();
    this.getReminders();
    this.getFrequencies();

    if ( this.medicationService.getUserAction() == 'addReminder' ) {
      let medication = this.medicationService.getMedicationData();
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
    this.reminderAction = 'reminderList';
    this.submitted = false;
    this.FormReminder.reset();
    this.FormReminder.enable();
    this.endingType = 0;
  }
  
  getFrequencies() {
    this.reminderService.getFrequencies().subscribe( res => {
      this.frequencies = res['frequencies'];
    });
  }
  
  getUnits() {
    this.reminderService.getUnits().subscribe( res => {
        
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

  formatedHour (hour, format) {
    return moment(hour).utc().format(format);
  }

  getReminders() {

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.reminderService.get().subscribe( res =>{
        
      const format = "DD/MM/YYYY";
      for(var i = 0; i < res['reminders'].length; i++){
        res['reminders'][i]['startDate'] = this.formatedDate(res['reminders'][i]['startDate'],format);
        if(res['reminders'][i]['endDate']){
          res['reminders'][i]['endDate'] = this.formatedDate(res['reminders'][i]['endDate'],format);
        }
      }

      this.userReminders = res['reminders'];
      Swal.close();

    }, (err) => {
      console.log(err.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al cargar sus medicamentos'
      });
    })
  }
  
  patchMedicationValues ( medication ) {
    this.FormReminder.patchValue({
      medicationName: medication['medicationName'],
      unit: medication['unit']
    });
    this.FormReminder.controls['medicationName'].disable();
    this.FormReminder.controls['unit'].disable();
    if (medication['grammage']) {
      this.FormReminder.controls['grammage'].setValue(medication['grammage']);
      this.FormReminder.controls['grammage'].disable();
    }
  }
  
  setFormValues (reminder) {
    
    if ( reminder['endDate'] === null) {
      this.FormReminder.controls['endDate'].setValue(null);
      this.FormReminder.controls['endingType'].setValue(1);
      this.endingType = 1;
    } else if ( reminder['endDate'] !== null ) {
      const endDate = moment(reminder['endDate'], "DD/MM/YYYY");
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
      timeNotification: this.formatedHour(reminder['timeNotification'], 'HH:mm').replace(':',''),
      inventory: reminder['inventory'],
      grammage: reminder['grammage']
    });
  }
  
  modifyReminder (reminder) {
    this.reminderAction = 'modifyReminder';
    this.submitted = false;

    this.endingType = 2;
    this.setFormValues(reminder);
    this.modifyId = reminder['id'];

    this.medName = reminder['medicationName'];
    this.unit = reminder['unit'];
    this.modifyGrammage = reminder['grammage']
  }

  checkReminder(reminder) {
    
    this.endingType = 2;
    this.setFormValues(reminder);

    this.medName = reminder['medicationName'];
    this.unit = reminder['unit'];
    this.modifyGrammage = reminder['grammage']
    
    this.FormReminder.disable();
    
    this.reminderAction = 'checkReminder';
  }

  deleteReminder (id) {
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

    }).then((result)=>{
      if(result.isConfirmed){
        Swal.fire({
          allowOutsideClick: false,
          icon: 'info',
          text:'Espere por favor...'
        });
        Swal.showLoading();
        this.reminderService.delete(id).subscribe( res => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text:'!Medicamento eliminado con éxito!',
            showConfirmButton: false,
          });

          setTimeout(()=>{
            this.getReminders();
          },1500);

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
  
  onSubmit( form: FormGroup ) {

    this.submitted = true;
    if ( form.invalid ) { return; }

    const format = "DD-MM-YYYY";
    const today = moment().toDate();
    
    if ( this.FormReminder.value.endDate == null || this.FormReminder.value.endDate == '' && this.endingType != 2) {
      this.FormReminder.patchValue({endDate: today});
    }
    if ( this.FormReminder.value.daysAmount == '' || this.FormReminder.value.daysAmount == null && this.endingType != 3) {
      this.FormReminder.patchValue({daysAmount: 1})
    }
    
    let reminder = { ...this.FormReminder.value };

    if ( this.endingType == 1 ) {
      delete reminder.endDate;
    }
    else if ( this.endingType == 2 ) { 
      reminder['endDate'] = this.formatedDate(reminder['endDate'], format); 
    }
    else if ( this.endingType == 3 ) { 
      reminder['endDate'] = moment(reminder['startDate']).add(reminder['daysAmount'], 'days').format(format)
    }
    delete reminder.daysAmount;
    delete reminder.endingType;

    if ( reminder['grammage'] == '' || reminder['grammage'] == null) {
      delete reminder.grammage;
    }
    if ( reminder['inventory'] == '' || reminder['inventory'] == null ) {
      delete reminder.inventory;
    }

    reminder['startDate'] = this.formatedDate(reminder['startDate'], format);
    reminder['timeNotification'] = reminder['timeNotification'].slice(0,2) + ':' + reminder['timeNotification'].slice(2,4);

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    
    if (this.reminderAction === 'newReminder') {
      this.reminderService.post(reminder)
      .subscribe( resp => {
  
        console.log(resp);
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text:'¡Medicamento creado con éxito!',
          showConfirmButton: false,
        });
  
        setTimeout(()=>{
          this.getReminders();
          this.volver();
        },1500);

        this.submitted = false
  
      }, (err)=> {
        console.log(err.error.message);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al crear el medicamento'
        });
      });
    } else if (this.reminderAction === 'modifyReminder') {
      this.reminderService.patch(this.modifyId, reminder)
      .subscribe(resp => {
        
        console.log(resp);

        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text:'¡Medicamento modificado con éxito!',
          showConfirmButton: false,
        });
  
        setTimeout(()=>{
          this.getReminders();
          this.volver();
        },1500);

        this.submitted = false;

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
