import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showDescMedicament: boolean = false;
  showDescPharmacy: boolean = false;
  showDescAppointment: boolean = false;
  showDescRequest: boolean = false;
  
  name: string;
  role: string;

  constructor( private authService: AuthService ) { }

  ngOnInit(): void {
    this.getNombre();
    this.setRole();
  }

  getNombre () {
    if ( localStorage.getItem('name') ) {
      this.name = localStorage.getItem('name');
    } 
  }

  getGender() {
    if ( localStorage.getItem('gender') ) {
      return localStorage.getItem('gender');
    }
    return '';
  }

  getPathName () {
    return window.location.pathname;
  }

  setRole() {
    this.role = this.authService.getRole();
  }

  screenWidth () {
    return window.screen.width;
  }

}
