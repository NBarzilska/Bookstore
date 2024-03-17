// book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  imageUrl?: string;
  owner: {
    _id: string;
    username: string;
  };
}

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books$!: Observable<Book[]>;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.books$ = this.http.get<Book[]>('http://localhost:3000/books');
  }
}
