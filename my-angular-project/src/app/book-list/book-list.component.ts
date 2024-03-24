import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  imageUrl?: string;
  owner?: string;
}

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  searchTerm: string = '';
  books$!: Observable<Book[]>;
  isLoggedIn$: boolean = false;
  userId: string = '';


  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.fetchBooks(); // Load books initially
    this.isLoggedIn$ = this.authService.isAuthenticated();
    this.userId = this.authService.getUserId();
  }

  fetchBooks(): void {
    this.books$ = this.http.get<Book[]>('http://localhost:3000/books');
  }

  isLoggedIn(): boolean {
    return this.isLoggedIn$;
  }

  logBook(book: Book) {
    console.log('Logged book:', book);
  }

  showDetails(book: Book): void {
    this.router.navigate(['/books', book._id]);
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      // If search term is empty, reset the list to show all books
      this.fetchBooks();
      return;
    }

    this.books$ = this.http.get<Book[]>(`http://localhost:3000/books/filter?title=${this.searchTerm}`);
  }

  toggleHeart(book: any): void {
    book.liked = !book.liked; // Toggle the liked state of the book
  }
  getUserIdFromLocalStorage(): string {
    const currentUserId = localStorage.getItem('userId');
    console.log(currentUserId);
    if (currentUserId != null) {
      return currentUserId;
    } else {
      return '';
    };
  };
}
