import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReminderService } from '../../services/reminder.service';
import { Reminder } from '../../models/reminder';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {
  
  userReminders: Reminder[] = [];

  reminderAction = 'reminderList';

  submitted = false;

  FormReminder: FormGroup;

  units = [];

  frequencies = [];
  
  constructor(
    private router: Router,
    private reminderService: ReminderService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    
    this.FormReminder = this.formBuilder.group({
      medicationName: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(55)]
      ],
      startDate: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-](0[1-9]|1[012])[-](19|20)[0-9]{2}'
          )
        ]
      ],
      endDate: [
        '',
        [
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],
      dose: [null, [Validators.required, Validators.pattern('[0-9]{1,7}')]],
      unit: [''],
      frequency: ['']
    });
    
    
    this.getUnits();
    this.getReminders();
    this.getFrequencies();
  }

  addReminder() {
    this.reminderAction = 'newReminder';
    this.FormReminder.reset();
  }
  
  volver() {
    this.reminderAction = 'reminderList';
  }
  
  //Obtener las frecuencias de la BD
  getFrequencies() {
    this.reminderService.getFrequencies().subscribe( res => {
      this.frequencies = res['frequencies'];
    });
  }
  
  //Obtener las unidades de la BD
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

  formatedDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }
  
  getReminders() {
    this.reminderService.get().subscribe( res =>{
        
      console.log(res);

      //Se formatea la fecha de ISO 8061 a dd/mm/aaaa
      for(var i = 0; i < res['reminders'].length; i++){
        res['reminders'][i]['startDate'] = this.formatedDate(res['reminders'][i]['startDate']);
        if(res['reminders'][i]['endDate']){
          res['reminders'][i]['endDate'] = this.formatedDate(res['reminders'][i]['endDate']);
        }
      }

      this.userReminders = res['reminders'];

      console.log(this.userReminders);

    }, (err) => {
      console.log(err.message);
  
      Swal.fire({
        icon: 'error',
        text: err.message,
        title: 'Error al cargar los recordatorios.'
      });  
    })
  }

  onSubmit( form: FormGroup ) {
    
    this.submitted = true;
    if ( form.invalid ) { return; }

    //Asignamos los valores del form al objeto reminder
    const reminder = { ...this.FormReminder.value };

    if ( reminder.endDate == null ) {
      delete reminder.endDate;
    }
    
    if ( reminder.unit == null ) {
      reminder.unit = this.units[0].description;
    }

    if ( reminder.frequency == null ) {
      reminder.frequency = this.frequencies[0].description;
    }

    console.log(reminder);

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    
    this.reminderService.post(reminder)
    .subscribe( resp => {

      console.log(resp);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text:'Recordatorio creado con éxito!'
      });

      this.volver();
      this.getReminders();
      this.submitted = false

    }, (err)=> {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al crear el recordatorio'
      });
    });
  }
}
