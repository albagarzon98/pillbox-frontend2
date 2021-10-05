import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-medicament',
  templateUrl: './add-medicament.component.html',
  styleUrls: ['./add-medicament.component.css']
})
export class AddMedicamentComponent implements OnInit {

  submitted: boolean = false;
  FormMedication: FormGroup;
  
  constructor(
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.FormMedication = this.formBuilder.group({
      medicationName: ['', [Validators.required, Validators.maxLength(55)]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    })
  }

  onSubmit( form: FormGroup ) { 
    this.submitted = true;

    if ( form.invalid ) {
      return;
    }
  }

}
