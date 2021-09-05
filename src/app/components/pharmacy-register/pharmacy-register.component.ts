import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pharmacy-register',
  templateUrl: './pharmacy-register.component.html',
  styleUrls: ['./pharmacy-register.component.css']
})
export class PharmacyRegisterComponent implements OnInit {

  FormPharmacy: FormGroup;
  submitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.FormPharmacy = this.formBuilder.group({
      pharmacyName: ['',[Validators.required, Validators.maxLength(55)]],
      branchOffices: ['',[Validators.required]],
      ownerName: ['',[Validators.required, Validators.maxLength(55), Validators.pattern('^[a-zA-Z\u00C0-\u00FF \']*$')]],
      ownerLastName: ['', [Validators.required, Validators.maxLength(55), Validators.pattern('^[a-zA-Z\u00C0-\u00FF \']*$')]],
      phone: ['', Validators.required],
      email: ['',[Validators.required, Validators.email]],
      address: ['',[Validators.required, Validators.maxLength(55), Validators.pattern('^[a-zA-Z0-9\u00C0-\u00FF \']*$')]]
    })
  }

  onSubmit( form: FormGroup ) {
    this.submitted = true;
    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      title: '¡Solicitud registrada!',
      text:'Nos pondremos en contacto contigo una vez que hayamos verificado tus datos.'
    });
  }

}
