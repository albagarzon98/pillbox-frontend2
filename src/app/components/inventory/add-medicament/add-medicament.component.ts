import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-medicament',
  templateUrl: './add-medicament.component.html',
  styleUrls: ['./add-medicament.component.css']
})
export class AddMedicamentComponent implements OnInit {

  submitted: boolean = false;
  FormMedicamentAdd: FormGroup;
  
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit( form: FormGroup ) { 
    if ( form.invalid ) {
      return;
    }
  }
}
