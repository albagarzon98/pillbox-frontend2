import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.router.onSameUrlNavigation = 'reload';
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor...'
    });
    Swal.showLoading();

    this.users = this.userService.getAll().results;

    Swal.close();
  }
}
