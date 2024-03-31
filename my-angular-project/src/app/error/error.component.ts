import { Component, OnInit } from '@angular/core';
import { trigger, keyframes, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  animations: [
    trigger('bounce', [
      transition(':enter', [
        animate('1s', keyframes([
          style({ transform: 'scale(0.1)', offset: 0 }),
          style({ transform: 'scale(1.2)', offset: 0.3 }),
          style({ transform: 'scale(0.9)', offset: 0.5 }),
          style({ transform: 'scale(1.1)', offset: 0.7 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ]),
      transition(':leave', [
        animate(0)
      ]),
      transition('* => *', [
        animate('1s', keyframes([
          style({ transform: 'scale(0.1)', offset: 0 }),
          style({ transform: 'scale(1.2)', offset: 0.3 }),
          style({ transform: 'scale(0.9)', offset: 0.5 }),
          style({ transform: 'scale(1.1)', offset: 0.7 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class ErrorComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {}

 
}
