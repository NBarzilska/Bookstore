import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export interface Item {
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './item-container.component.html',
  styleUrls: ['./item-container.component.css'],
 // changeDetection: ChangeDetectionStrategy.OnPush,
});

export class ItemContainerComponent implements OnChanges {
  @Input('items') itemListData:  Item[] = [];

  constructor(private cd: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('on chnages');
 }
}