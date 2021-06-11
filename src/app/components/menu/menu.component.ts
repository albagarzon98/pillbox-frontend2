import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  navbarOpen = false;

  constructor( private auth: AuthService,
               private router: Router) { }

  ngOnInit(): void {

  }
  
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }
  
  salir() {
    this.auth.logout();    
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Cerrando sesión...'
    });
    Swal.showLoading();
    Swal.close();

    this.router.navigateByUrl('/login');

  }

  isAuthenticated ():boolean {
    return this.auth.getIsAuth();
  }

  readName ():string {
    return this.auth.readName();
  }
}
