import { Component, OnInit } from '@angular/core';
import { PharmacyRequest } from 'src/app/models/pharmacy-request';
import Swal from 'sweetalert2';
import { PharmacyRequestService } from '../../services/pharmacy-request.service';

@Component({
  selector: 'app-pharmacy-requests',
  templateUrl: './pharmacy-requests.component.html',
  styleUrls: ['./pharmacy-requests.component.css']
})
export class PharmacyRequestsComponent implements OnInit {

  requests = [];

  constructor( private pharmacyRequestService: PharmacyRequestService ) { }
  
  ngOnInit(): void {
    this.getRequests();
  }

  expandData( request ) {
    if (!request.expand) {
      request.expand = false;
    }
    request.expand = !request.expand;
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
