import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import Swal from 'sweetalert2';
import { PharmacyRequestService } from '../../services/pharmacy-request.service';
import { PharmacyRequest } from '../../models/pharmacy-request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pharmacy-register',
  templateUrl: './pharmacy-register.component.html',
  styleUrls: ['./pharmacy-register.component.css']
})
export class PharmacyRegisterComponent implements OnInit {

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
  
  pharmacyRequest: PharmacyRequest;
  FormPharmacy: FormGroup;
  submitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private pharmacyRequestService: PharmacyRequestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.FormPharmacy = this.formBuilder.group({
      pharmacyName: ['',[Validators.required, Validators.maxLength(55)]],
      branchesNumber: ['',[Validators.required]],
      // ownerName: ['',[Validators.required, Validators.maxLength(55), Validators.pattern('^[a-zA-Z\u00C0-\u00FF \']*$')]],
      // ownerLastName: ['', [Validators.required, Validators.maxLength(55), Validators.pattern('^[a-zA-Z\u00C0-\u00FF \']*$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10,11}')]],
      contactEmail: ['',[Validators.required, Validators.email]],
      address: ['',[Validators.required, Validators.maxLength(55)]]
    })
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

  onSubmit( form: FormGroup ) {
    this.submitted = true;
    if ( form.invalid ) { return; }

    this.pharmacyRequest = {...this.FormPharmacy.value};

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    this.pharmacyRequestService.post(this.pharmacyRequest).subscribe(res => {
      
      console.log(res);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        title: '¡Solicitud registrada!',
        text:'Nos pondremos en contacto contigo una vez que hayamos verificado tus datos.'
      });

      this.router.navigateByUrl('/pharmacyRegister');

    }, (err) => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al registrar su solicitud.'
      });
    })
  }

}
