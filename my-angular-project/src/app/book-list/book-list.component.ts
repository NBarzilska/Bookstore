// book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Import Router here
import { AuthService } from '../auth.service'; // Import AuthService here

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  imageUrl?: string;
  owner: string;
}

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})

export class BookListComponent implements OnInit {
  books$!: Observable<Book[]>;
  isLoggedIn$: boolean = false; // Variable to store user login status
  userId: string = ''; // Variable to store current user's ID

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.books$ = this.http.get<Book[]>('http://localhost:3000/books');
    this.isLoggedIn$ = this.authService.isAuthenticated(); // Check user login status
    this.userId = this.authService.getUserId(); // Get current user's ID
  }

  isLoggedIn(): boolean {
    return this.isLoggedIn$; // Return user login status
  }
  logBook(book: any) {
    console.log('Logged book:', book);
  }

  showDetails(book: Book): void {
    // Navigate to the details route with book id as parameter
    this.router.navigate(['/books', book._id]);
  }
}
