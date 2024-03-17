// item-list.component.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Item } from '../item/item.interface';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemListComponent implements OnChanges {
  @Input('items') itemListData: Item[] = [];

  constructor(private cd: ChangeDetectorRef){ }
  ngOnChanges(changes: SimpleChanges): void {
    console.log({ changes })
  }

}