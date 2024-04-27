import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { Router } from '@angular/router';
import { Branch } from 'src/app/models/branch';
import Swal from 'sweetalert2';
import { BranchService } from '../../../services/branch.service';

@Component({
  selector: 'app-branch-form',
  templateUrl: './branch-form.component.html',
  styleUrls: ['./branch-form.component.css']
})
export class BranchFormComponent implements OnInit {

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
  FormBranchAdd: FormGroup;
  userAction: string;
  branch: Branch;

  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private branchService: BranchService
  ) { }

  ngOnInit(): void {

    this.FormBranchAdd = this.formBuilder.group({
      branchName: ['', [Validators.required, Validators.maxLength(55)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{10,11}')]],
      businessHours: ['', [Validators.required, Validators.maxLength(200)]],
      realAddress: ['', [Validators.required, Validators.maxLength(55)]]
    });

    this.userAction = this.branchService.getUserAction();
    this.branch = this.branchService.getBranchData();
    this.setFormValues();
  }

  setFormValues() {
    if (this.userAction != 'newBranch') {
      this.FormBranchAdd.patchValue({
        branchName: this.branch.branchName,
        phoneNumber: this.branch.phoneNumber,
        businessHours: this.branch.businessHours,
        realAddress: this.branch.realAddress
      });
    };
  }

  ngAfterViewInit(): void {

    const searchBox = new google.maps.places.SearchBox(
      this.searchField.nativeElement,
    );

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) {
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

  onSubmit(form: FormGroup) {
    this.submitted = true;
    if (form.invalid) {
      return;
    }

    let branch: Branch = { ...this.FormBranchAdd.value };
    let pharmacyId: string = localStorage.getItem('profilePharmacy');

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
      heightAuto: false
    });
    Swal.showLoading();
    if (this.userAction == 'newBranch') {

      this.branchService.post(branch, pharmacyId).subscribe(res => {
        console.log(res);
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text: '¡Sucursal creada con éxito!',
          showConfirmButton: false
        });
        setTimeout(() => {
          this.router.navigateByUrl('/pharmacy/profile');
        }, 1200);
      }, err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al crear la sucursal'
        });
      });
    }

    if (this.userAction == 'modifyBranch') {
      let branchId = this.branch.id;
      this.branchService.patch(branch, branchId).subscribe(res => {
        console.log(res);
        Swal.fire({
          allowOutsideClick: false,
          icon: 'success',
          text: '¡Sucursal modificada con éxito!',
          showConfirmButton: false
        });
        setTimeout(() => {
          this.router.navigateByUrl('/pharmacy/profile');
        }, 1200);
      }, err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          text: err.error.message,
          title: 'Error al modificar la sucursal'
        });
      });
    }
  }

}
