import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  }

}
