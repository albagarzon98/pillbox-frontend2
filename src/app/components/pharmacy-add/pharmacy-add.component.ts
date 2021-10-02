import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { Pharmacy } from 'src/app/models/pharmacy';
import Swal from 'sweetalert2';
import { PharmacyService } from '../../services/pharmacy.service';

@Component({
  selector: 'app-pharmacy-add',
  templateUrl: './pharmacy-add.component.html',
  styleUrls: ['./pharmacy-add.component.css']
})
export class PharmacyAddComponent implements OnInit {

    //Maps
    @ViewChild('mapSearchField') searchField: ElementRef;
    @ViewChild(GoogleMap) map: GoogleMap;
    initialCoordinates = {
      lat: -31.420211, 
      lng: -64.188854
    }
    mapConfigurations = {
      zoomControl: true
    }
  
  submitted: boolean = false;
  FormPharmacyAdd: FormGroup;
  
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private pharmacyService: PharmacyService
  ) { }

  ngOnInit(): void {

    this.FormPharmacyAdd = this.formBuilder.group({
      pharmacyName: ['',[Validators.required, Validators.maxLength(55)]],
      // ownerName: ['',[Validators.required, Validators.maxLength(55), Validators.pattern('^[a-zA-Z\u00C0-\u00FF \']*$')]],
      // ownerLastName: ['', [Validators.required, Validators.maxLength(55), Validators.pattern('^[a-zA-Z\u00C0-\u00FF \']*$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10,11}')]],
      contactEmail: ['',[Validators.required, Validators.email]],
      businessHours: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['',[Validators.required, Validators.maxLength(55)]]
    })

    this.getPharmacyAdd();
  }

  ngAfterViewInit():void {
    
    const searchBox = new google.maps.places.SearchBox(
      this.searchField.nativeElement,
    );
    
    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if ( places.length === 0 ) {
        return;
      }
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        if (!place.geometry || !place.geometry.location) {
          return;
        }
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  }

  getPharmacyAdd() {
    let pharmacy: Pharmacy = this.pharmacyService.getPharmacyAdd();

    this.FormPharmacyAdd.patchValue({
      pharmacyName: pharmacy.pharmacyName,
      phoneNumber: pharmacy.phoneNumber,
      contactEmail: pharmacy.contactEmail,
      address: pharmacy.address
    });
  }

  onSubmit( form: FormGroup ) { 
    this.submitted = true;
    if ( form.invalid ) { return; }

    let pharmacy: Pharmacy = {...this.FormPharmacyAdd.value};
    pharmacy.branches = [];

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    
    this.pharmacyService.post(pharmacy).subscribe(res => {

      console.log(res);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        title: '¡Farmacia registrada con éxito!',
      });

      this.router.navigateByUrl('/pharmacyRequests');
    }, err => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al registrar la farmacia.'
      });
    });
  }

}
