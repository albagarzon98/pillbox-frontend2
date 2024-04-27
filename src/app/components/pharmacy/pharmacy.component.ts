import { Component, OnInit } from '@angular/core';
import { PharmacyService } from '../../services/pharmacy.service';
import { Pharmacy } from '../../models/pharmacy';
import Swal from 'sweetalert2';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { TutorService } from 'src/app/services/tutor.service';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent implements OnInit {

  pharmacies: Pharmacy[];

  constructor(
    private pharmacyService: PharmacyService,
    private tutorService: TutorService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        if (events[0].urlAfterRedirects == '/home' && events[1].urlAfterRedirects == '/pharmacy') {
          localStorage.removeItem('userAction')
          localStorage.removeItem('patientData')
          this.tutorService.setUserAction('')
        }
      });

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
      heightAuto: false
    });
    Swal.showLoading();
    this.getPharmacies();
  }

  route() {
    return this.router.url;
  }

  pharmacyProfile(pharm) {
    let pharmacyId: string = pharm['id'];

    this.pharmacyService.profilePharmacy(pharmacyId);
    this.router.navigateByUrl('/pharmacy/profile');
  }

  getPharmacies() {
    this.pharmacyService.get().subscribe(res => {

      console.log(res);
      this.pharmacies = res['pharmacies'];
      Swal.close();
    }, err => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al obtener las farmacias'
      });
    });
  }

}
