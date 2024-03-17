import { Injectable, OnDestroy } from '@angular/core';
import { Item } from './item/item.interface';

@Injectable(
  {
    // в кой модул да се inject-ва
    providedIn: 'root'
  }
)
export class ItemService implements OnDestroy {
  //title = "my-productList"
  URL = 'https://jsonplaceholder.typicode.com/albums'
  items: Item[] = [
    { name: 'Item 1', price: 10, description: 'Description of item 1' },
    { name: 'Item 2', price: 12, description: 'Description of item 2' }
     //Add more items as needed
  ];

  ngOnDestroy(): void {
    // clear terminal, detach from events
  }

  getItems() {
    return fetch(this.URL).then((res) => res.json());
  }

  addItem(inputName: HTMLInputElement, inputPrice: HTMLInputElement, inputDescription: HTMLInputElement) {
    const item: Item = {
      name: inputName.value,
      price: Number(inputPrice.value),
      description: inputDescription.value,
    };

    //this.items.push(item);
    // за да ъпдейтнем вюто, така създаваме при всеки клик нова референция
    // this.items = [...this.items, item]

    inputName.value = '';
    inputPrice.value = '';
    inputDescription.value = '';
  }
}
