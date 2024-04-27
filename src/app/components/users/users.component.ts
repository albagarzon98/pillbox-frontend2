import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: UserModel[] = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  route() {
    return this.router.url;
  }

  getUsers() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...',
      heightAuto: false
    });
    Swal.showLoading();

    this.userService.getAll().subscribe(res => {
      this.users = res['results'];
      Swal.close();
    }, err => {
      console.log(err.error.message);
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al obtener los usuarios'
      });
    });
  }
}
