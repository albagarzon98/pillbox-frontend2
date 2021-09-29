import { Component, OnInit } from '@angular/core';
import { PharmacyRequest } from 'src/app/models/pharmacy-request';
import Swal from 'sweetalert2';
import { PharmacyRequestService } from '../../services/pharmacy-request.service';
import { Router } from '@angular/router';
import { PharmacyService } from '../../services/pharmacy.service';
import { Pharmacy } from 'src/app/models/pharmacy';

@Component({
  selector: 'app-pharmacy-requests',
  templateUrl: './pharmacy-requests.component.html',
  styleUrls: ['./pharmacy-requests.component.css']
})
export class PharmacyRequestsComponent implements OnInit {

  requests = [];

  constructor( private pharmacyRequestService: PharmacyRequestService,
               private router: Router,
               private pharmacyService: PharmacyService ) { }
  
  ngOnInit(): void {
    this.getRequests();
  }

  route () {
    return this.router.url;
  }
  
  expandData( request ) {
    if (!request.expand) {
      request.expand = false;
    }
    request.expand = !request.expand;
  }

  addPharmacy( request ) {
    const pharmacy = new Pharmacy();
    pharmacy.pharmacyName = request.pharmacyName;
    pharmacy.address = request.address;
    pharmacy.contactEmail = request.contactEmail;
    pharmacy.phoneNumber = request.phoneNumber;

    this.pharmacyService.addPharmacy(pharmacy);

    this.router.navigateByUrl('/pharmacyRequests/add');
  }

  getRequests() {
    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();
    
    this.pharmacyRequestService.get().subscribe(res=>{
      
      Swal.close();
      console.log(res);
      this.requests = res['results']
    },err=>{
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        title: 'Error al obtener las solicitudes'
      });
    });
  }
}
