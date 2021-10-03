import { trigger, state, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
  animations: [
    trigger('fade', [
      
      transition('void => *', [
        style({ opacity: 0, transform: 'translate3d(0, -20%, 0)' }),
        animate(300)
      ]),
      
      transition('* => void', [
        animate(300, style({ opacity: 0, transform: 'translate3d(0, -20%, 0)' }))
      ])

    ])
  ]
})
export class InventoryComponent implements OnInit {

  expand: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  expands () {
    this.expand = !this.expand;
  }

}
