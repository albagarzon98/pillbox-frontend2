import { Component, OnInit } from '@angular/core';
import { PharmacyRequest } from 'src/app/models/pharmacy-request';
import Swal from 'sweetalert2';
import { PharmacyRequestService } from '../../services/pharmacy-request.service';
import { Router } from '@angular/router';
import { PharmacyService } from '../../services/pharmacy.service';
import { Pharmacy } from 'src/app/models/pharmacy';
import { state, trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-pharmacy-requests',
  templateUrl: './pharmacy-requests.component.html',
  styleUrls: ['./pharmacy-requests.component.css'],
  animations: [
    trigger('expand', [
      state('in', style({
        height: '50px',
        overflow: 'hidden'
      })),
      state('out', style({
        height: '270px',
        overflow: 'hidden',
        padding: '5px 5% 15px 5%'
      })),
      state('mobileIn', style({
        height: '50px',
        overflow: 'hidden'
      })),
      state('mobileOut', style({
        height: '250px',
        overflow: 'hidden',
        padding: '5px 5% 15px 5%'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]
})

export class PharmacyRequestsComponent implements OnInit {

  requests = [];

  constructor( private pharmacyRequestService: PharmacyRequestService,
               private router: Router,
               private pharmacyService: PharmacyService ) { 
              
              this.router.routeReuseStrategy.shouldReuseRoute = function() {
                return false;
              };
              this.router.onSameUrlNavigation = 'reload';
  }
  
  ngOnInit(): void {
    this.getRequests();
  }

  route () {
    return this.router.url;
  }
  
  expandData( request ) {
    if ( window.screen.width < 500) {
      request.state = request.state === 'mobileOut' ? 'mobileIn' : 'mobileOut';
    } else {
      request.state = request.state === 'out' ? 'in' : 'out';
    }
    
    if (!request.expand) {
      request.expand = false;
    }
    request.expand = !request.expand;
  }

  addPharmacy( request ) {
    
    let pharmacy = new Pharmacy();
    pharmacy.pharmacyName = request.pharmacyName;
    pharmacy.address = request.address;
    pharmacy.contactEmail = request.contactEmail;
    pharmacy.phoneNumber = request.phoneNumber;

    let requestId = request.id;

    this.pharmacyService.addPharmacy(pharmacy, requestId);

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
