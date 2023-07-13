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
  role: string;

  constructor( private auth: AuthService,
               private router: Router) { }

  ngOnInit(): void {

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

  screenWidth () {
    return window.screen.width;
  }

  //Esta función retorna true cuando el usuario inicia sesión y false cuando el usuario cierra sesión
  isAuthenticated ():boolean {
    return this.auth.getIsAuth();
  }

  //Esta función obtiene el rol del localStorage
  getRole ():string {
    if( localStorage.getItem('role') ){
      this.role = localStorage.getItem('role');
      return localStorage.getItem('role');
    }
    else {
      return '';
    }
  }

  readName ():string {
    return this.auth.readName();
  }

  readFullName () {
    if ( localStorage.getItem('fullName') ) {
      return localStorage.getItem('fullName');
    }
    return '';
  }
}
