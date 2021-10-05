import { trigger, state, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  animations: [
    trigger('fade', [
      
      transition('void => *', [
        style({ opacity: 0, transform: 'translate3d(0, -20%, 0)' }),
        animate(200)
      ]),
      
      transition('* => void', [
        animate(200, style({ opacity: 0, transform: 'translate3d(0, -20%, 0)' }))
      ]),

    ]),
    
    // Animación div expand
    // trigger('expand', [
    //   state('in', style({
    //     height: '275px',
    //   })),
    //   state('out', style({
    //     height: '450px',
    //   })),
    //   transition('in => out', animate('200ms ease-in-out')),
    //   transition('out => in', animate('200ms ease-in-out'))
    // ])
  ]
})
export class InventoryComponent implements OnInit {

  expand: boolean = false;
  state: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  route () {
    return this.router.url;
  }

  expands () {
    // this.state = this.state === 'out' ? 'in' : 'out';
    this.expand = !this.expand;
  }

  // expandToFalse () {
  //   this.expand = false;
  // }

}
