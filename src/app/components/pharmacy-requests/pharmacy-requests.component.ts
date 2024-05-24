import { Component, OnInit } from '@angular/core';
import { PharmacyRequest } from 'src/app/models/pharmacy-request';
import Swal from 'sweetalert2';
import { PharmacyRequestService } from '../../services/pharmacy-request.service';
import { Router } from '@angular/router';
import { PharmacyService } from '../../services/pharmacy.service';
import { Pharmacy } from 'src/app/models/pharmacy';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { loader } from 'src/app/utils/swalUtils';

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
  filter: string = "Todas";

  constructor(private pharmacyRequestService: PharmacyRequestService,
    private router: Router,
    private pharmacyService: PharmacyService) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {
    this.getRequests();
  }

  route() {
    return this.router.url;
  }

  filterPendent() {

    loader();
    this.pharmacyRequestService.getPendent().subscribe(res => {
      Swal.close();
      this.requests = res['results'];
      this.filter = "Pendiente";
    }, err => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al obtener las solicitudes'
      });
    });
  }

  filterApproved() {

    loader();
    this.pharmacyRequestService.getApproved().subscribe(res => {
      Swal.close();
      this.requests = res['results'];
      this.filter = "Aprobada";
    }, err => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al obtener las solicitudes'
      });
    });
  }

  filterRejected() {

    loader();
    this.pharmacyRequestService.getRejected().subscribe(res => {
      Swal.close();
      this.requests = res['results'];
      this.filter = "Rechazada";
    }, err => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al obtener las solicitudes'
      });
    });
  }

  expandData(request) {
    if (window.screen.width < 500) {
      request.state = request.state === 'mobileOut' ? 'mobileIn' : 'mobileOut';
    } else {
      request.state = request.state === 'out' ? 'in' : 'out';
    }

    if (!request.expand) {
      request.expand = false;
    }
    request.expand = !request.expand;
  }

  rejectRequest(request) {
    let rejected = {
      pharmacyRequestId: request['id'],
      status: 'rechazado'
    }

    loader();
    this.pharmacyRequestService.patch(rejected).subscribe(res => {
      console.log(res);
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text: 'Solicitud rechazada',
        showConfirmButton: false,
      });
      setTimeout(() => {
        this.router.navigateByUrl('/pharmacyRequests');
      }, 1200);
    }, err => {
      console.log(err);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al eliminar el medicamento'
      });
    });
  }

  addPharmacy(request) {

    let pharmacy = new Pharmacy();
    pharmacy.pharmacyName = request.pharmacyName;
    pharmacy.address = request.address;
    pharmacy.contactEmail = request.contactEmail;
    pharmacy.phoneNumber = request.phoneNumber;
    pharmacy.urlLogo = request.urlLogo;

    let requestId = request.id;

    this.pharmacyService.addPharmacy(pharmacy, requestId);
    this.pharmacyService.setUserAction('newPharmacy');
    this.router.navigateByUrl('/pharmacyRequests/add');
  }

  getRequests() {

    loader();

    this.pharmacyRequestService.get().subscribe(res => {

      Swal.close();
      console.log(res);
      this.requests = res['results']
      this.filter = "Todas";
    }, err => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al obtener las solicitudes'
      });
    });
  }
}
