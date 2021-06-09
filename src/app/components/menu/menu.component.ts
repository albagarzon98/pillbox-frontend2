import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    this.router.navigateByUrl('/login');
  }

}
