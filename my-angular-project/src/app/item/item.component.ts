// item.component.ts
import { Component, Input } from '@angular/core';
import { Item } from './item.interface';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input('item') item = {} as Item;
}