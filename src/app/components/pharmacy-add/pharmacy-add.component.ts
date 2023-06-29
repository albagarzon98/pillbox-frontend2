import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import { Pharmacy } from 'src/app/models/pharmacy';
import Swal from 'sweetalert2';
import { PharmacyService } from '../../services/pharmacy.service';
import { BranchService } from '../../services/branch.service';
import { PharmacyRequestService } from 'src/app/services/pharmacy-request.service';
import { PharmacyRequest } from 'src/app/models/pharmacy-request';

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
  userAction: string;
  pharmacy: Pharmacy;

  
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private pharmacyService: PharmacyService,
    private branchService: BranchService,
    private pharmacyRequestService: PharmacyRequestService
  ) { }

  ngOnInit(): void {

    this.FormPharmacyAdd = this.formBuilder.group({
      pharmacyName: ['',[Validators.required, Validators.maxLength(55)]],
      // ownerName: ['',[Validators.required, Validators.maxLength(55), Validators.pattern('^[a-zA-Z\u00C0-\u00FF \']*$')]],
      // ownerLastName: ['', [Validators.required, Validators.maxLength(55), Validators.pattern('^[a-zA-Z\u00C0-\u00FF \']*$')]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10,11}')]],
      contactEmail: ['',[Validators.required, Validators.email]],
      businessHours: ['', [Validators.required, Validators.maxLength(200)]],
      address: ['',[Validators.required, Validators.maxLength(55)]],
      urlLogo: ['',[Validators.pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)]]
    })

    this.userAction = this.pharmacyService.getUserAction();

    if(this.userAction == 'modifyPharmacy'){

      this.pharmacy = this.pharmacyService.getPharmacyData();
      this.FormPharmacyAdd.removeControl('businessHours');
      this.setFormValues();
    
    }

    if(this.userAction != 'modifyPharmacy'){
      
      this.getPharmacyAdd();
    }

 
  }

  setFormValues () {
    if ( this.userAction != 'newPharmacy' ) {
      
      this.FormPharmacyAdd.patchValue({
        pharmacyName: this.pharmacy.pharmacyName,
        phoneNumber: this.pharmacy.phoneNumber,
        contactEmail: this.pharmacy.contactEmail,
        address: this.pharmacy.address,
        urlLogo: this.pharmacy.urlLogo
      });
    };
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
      address: pharmacy.address,
      urlLogo: pharmacy.urlLogo
    });
  }

  onSubmit(form: FormGroup): void { 
    this.submitted = true;
    if (form.invalid) {
      return;
    }

    if (this.userAction === 'newPharmacy') {
      this.createNewPharmacy();
    }

    if (this.userAction === 'modifyPharmacy') {
      this.modifyExistingPharmacy();
    }
  }
  createNewPharmacy(): void {
    const pharmacy: Pharmacy = { ...this.FormPharmacyAdd.value };
    delete pharmacy['businessHours'];
    pharmacy.branches = [];
    console.log(pharmacy);

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.pharmacyService.post(pharmacy).subscribe(
      res => {
        const pharmacyId = res['id'];
        
        let branch: Branch = new Branch();
        branch.branchName = pharmacy.pharmacyName;
        branch.phoneNumber = pharmacy.phoneNumber;
        branch.realAddress = pharmacy.address;
        branch.businessHours = this.FormPharmacyAdd.value['businessHours'];

        this.branchService.post(branch, pharmacyId).subscribe(
          res => {
            Swal.fire({
              allowOutsideClick: false,
              icon: 'success',
              title: '¡Farmacia registrada con éxito!',
              showConfirmButton: false
            });

            const requestId = this.pharmacyService.getRequestId();
            const pharmacyRequest = {
              pharmacyRequestId: requestId,
              status: 'aprobado'
            };

            this.pharmacyRequestService.patch(pharmacyRequest).subscribe(
              res => {
                setTimeout(() => {
                  this.router.navigateByUrl('/pharmacyRequests');
                }, 1200);
              },
              err => {
                console.log(err);
              }
            );
          },
          err => {
            Swal.fire({
              icon: 'error',
              text: err.error.message,
              title: 'Error al registrar la sucursal.'
            });
          }
        );
      },
      err => {
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al registrar la farmacia.'
        });
      }
    );
  }

  modifyExistingPharmacy(): void {
    const pharmacy: Pharmacy = { ...this.FormPharmacyAdd.value };

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    const pharmacyId = this.pharmacy.id;
    this.pharmacyService.patch(pharmacy, pharmacyId).subscribe(
      res => {
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text: 'Farmacia modificada con éxito!',
          showConfirmButton: false
        });
        setTimeout(() => {
          this.router.navigateByUrl('/pharmacy/profile');
        }, 1200);
      },
      err => {
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al modificar la farmacia'
        });
      }
    );
  }

}
