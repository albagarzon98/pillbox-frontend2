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
  
  time = {hour: 13, minute: 30};
  
  userReminders: Reminder[] = [];

  reminderAction = 'reminderList';

  //Booleano que se activa cuando el formulario es enviado, me sirve para manejar los validators
  submitted = false;

  FormReminder: FormGroup;

  medName = '';
  unit = '';

  units = [];

  frequencies = [];

  //Cuando modificamos un recordatorio, el id del recordatorio a modificar se almacena
  //en este atributo
  modifyId = '';
  
  constructor(
    private router: Router,
    private reminderService: ReminderService,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    
    this.FormReminder = this.formBuilder.group({
      medicationName: [
        '',
        [Validators.required, Validators.maxLength(55)]
      ],
      startDate: ['' , [Validators.required] ],
      endDate: [''],
      dose: [null, [Validators.required, Validators.pattern('[0-9]{1,7}')]],
      unit: ['', [Validators.required] ],
      frequency: ['', [Validators.required] ],
      timeNotification: ['', [Validators.required, Validators.pattern('^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$')]]
    });
    
    
    this.getUnits();
    this.getReminders();
    this.getFrequencies();
  }

  addReminder() {
    this.reminderAction = 'newReminder';
    this.submitted = false;
    this.unit = '';
    this.FormReminder.enable();
    this.FormReminder.reset();
  }
  
  volver() {
    this.reminderAction = 'reminderList';
    this.FormReminder.enable();
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

  //Esta función se utiliza para formatear la fechas, recibe como parametro la fecha a formatear
  //y el formato que se le quiere dar, por ejemplo, si enviamos como parámetros:
  //date = "2021-06-22T03:00:00.000Z"
  //format = "DD/MM/YYYY"
  //la función devuelve "22/06/2021"
  formatedDate(date, format) {
    return moment(date).format(format);
  }

  formatedHour (hour, format) {
    return moment(hour).utc().format(format);
  }
  
  getReminders() {
    
    // Swal.fire({
    //   allowOutsideClick: false,
    //   icon: 'info',
    //   text:'Espere por favor...'
    // });
    // Swal.showLoading();

    this.reminderService.get().subscribe( res =>{
        
      console.log(res);
      // Swal.close();

      //Se formatea la fecha de ISO 8061 a dd/mm/aaaa
      const format = "DD/MM/YYYY";
      for(var i = 0; i < res['reminders'].length; i++){
        res['reminders'][i]['startDate'] = this.formatedDate(res['reminders'][i]['startDate'],format);
        if(res['reminders'][i]['endDate']){
          res['reminders'][i]['endDate'] = this.formatedDate(res['reminders'][i]['endDate'],format);
        }
      }

      this.userReminders = res['reminders'];

      console.log(this.userReminders);

    }, (err) => {
      console.log(err.message);
    })
  }
  
  setFormValues (reminder) {
    
    //Verificamos si el recordatorio tiene una fecha de finalización asignada
    //Si no lo tiene, seteamos el valor como null
    //Si lo tiene mostramos la fecha de la manera correcta
    if ( reminder['endDate'] === null) {
      this.FormReminder.controls['endDate'].setValue(null);
    } else if ( reminder['endDate'] !== null ) {
      const endDate = moment(reminder['endDate'], "DD/MM/YYYY");
      this.FormReminder.controls['endDate'].setValue(endDate);
    }

    this.FormReminder.patchValue({      
      dose: reminder['dose'],
      startDate: moment(reminder['startDate'], "DD/MM/YYYY"),
      frequency: reminder['frequency'],
      medicationName: reminder['medicationName'],
      unit: reminder['unit'],
      timeNotification: this.formatedHour(reminder['timeNotification'], 'HH:mm')
    });
  }
  
  modifyReminder (reminder) {
    this.reminderAction = 'modifyReminder';
    this.setFormValues(reminder);
    this.modifyId = reminder['id'];

    this.medName = reminder['medicationName'];
    this.unit = reminder['unit'];
  }

  checkReminder(reminder) {
    
    //Se setean los valores del recordatorio en el formulario
    this.setFormValues(reminder);
    
    //Estos atributos se requieren para mostrar el nombre del medicamento y la imagen correspondiente a la
    //unidad en el HTML
    this.medName = reminder['medicationName'];
    this.unit = reminder['unit'];
    
    //Se deshabilitan los campos del form
    this.FormReminder.disable();
    
    //Se cambia el valor de reminderAction a 'checkReminder' para mostrar el form en el HTML
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
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text:'Espere por favor...'
      });
      Swal.showLoading();
      if(result.isConfirmed){
        this.reminderService.delete(id).subscribe( res => {
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text:'Medicamento eliminado exitosamente!'
          });
          this.getReminders();
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

    //Asignamos los valores del form al objeto reminder
    let reminder = { ...this.FormReminder.value };
    
    const format = "DD-MM-YYYY";
    reminder['startDate'] = this.formatedDate(reminder['startDate'], format);

    //Si no se ingresa una fecha de finalización borramos el atributo
    if ( reminder.endDate == null ) {
      delete reminder.endDate;
    }
    else { reminder['endDate'] = this.formatedDate(reminder['endDate'], format); }

    reminder['timeNotification'] = reminder['timeNotification'].slice(0,2) + ':' + reminder['timeNotification'].slice(2,4);

    console.log(reminder);

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
    } else if (this.reminderAction === 'modifyReminder') {
      this.reminderService.patch(this.modifyId, reminder)
      .subscribe(resp => {
        
        //Se muestra la respuesta en consola
        console.log(resp);

        //Se muestra la alerta
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text:'Recordatorio modificado con éxito!'
        });
  
        this.volver();
        this.getReminders();
        this.submitted = false;

      }, (err) => {
        
        console.log(err.error.message);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al modificar el recordatorio'
        });
      })
    }

  }
}
