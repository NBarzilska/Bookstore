import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ItemService } from './item.service';
import { Item } from './item/item.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ItemService],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit{
  title='my-angular-project';
  appItems: Item[] = [];

  constructor(public itemService: ItemService) {
    this.appItems = this.itemService.items;
  }
  
  ngOnInit(): void {
    this.itemService.getItems().then((items) => {
      console.log('items data ', items);
      this.appItems = items;
    });
  }
  
  setItems(inputName: HTMLInputElement, inputPrice: HTMLInputElement, inputDescription: HTMLInputElement) {
    //TODO Validation of inputs / transformation of the input
    this.itemService.addItem(inputName,inputPrice,inputDescription);
    //TODO additional functionality to add
  }
}