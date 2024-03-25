import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { BookService } from '../book.service';

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


  constructor(private http: HttpClient, private authService: AuthService, private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    this.fetchBooks(); // Load books initially
    this.isLoggedIn$ = this.authService.isAuthenticated();
    this.userId = this.authService.getUserId();
  }

  fetchBooks(): void {
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    // Append the userId as a query parameter if it exists, otherwise, fetch without userId
    const url = userId ? `http://localhost:3000/books?userId=${userId}` : 'http://localhost:3000/books';
    this.books$ = this.http.get<Book[]>(url);
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
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
    // Trim the search term and check if it's empty
    if (!this.searchTerm.trim()) {
      // If search term is empty, reset the list to show all books
      this.fetchBooks();
      return;
    }
  
    // Construct the URL with the search term, and include the userId query parameter if it exists
    const url = userId ? `http://localhost:3000/books/filter?title=${this.searchTerm}&userId=${userId}` : `http://localhost:3000/books/filter?title=${this.searchTerm}`;
    this.books$ = this.http.get<Book[]>(url);
  }
  

  toggleHeart(book: any): void {
    book.liked = !book.liked; // Toggle the liked state of the book

    this.bookService.likeBook(book._id, this.getUserIdFromLocalStorage(), book.liked).subscribe(
      (result) => {
        console.log(result);
        // Handle the result here, for example, navigate or perform any other action
       
      },
      (error) => {
        console.error('Error deleting book:', error);
        // Handle error
      }
    );
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
