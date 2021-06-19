import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  name: string = '';

  constructor( ) { }

  ngOnInit(): void {
    this.getNombre();
  }

  getNombre () {
    if ( localStorage.getItem('name') ) {
      this.name = localStorage.getItem('name');
    } 
  }

}
