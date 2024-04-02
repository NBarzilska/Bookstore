import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { faHeart , faMessage } from '@fortawesome/free-solid-svg-icons';
import { BookService } from '../book.service';

export interface Book {
  _id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  imageUrl?: string;
  owner?: string;
  liked: boolean
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
   ; // Load books initially
    this.isLoggedIn$ = this.authService.isLogged;
    this.userId = this.authService.getUserId();
    this.fetchBooks();
  }

  fetchBooks(): void {
    // Append the userId as a query parameter if it exists, otherwise, fetch without userId
    const url = this.userId ? `http://localhost:3000/books?userId=${this.userId}` : 'http://localhost:3000/books';
    this.books$ = this.http.get<Book[]>(url);
  }

  isLoggedIn(): boolean {
    return this.isLoggedIn$;
  }

  logBook(book: Book) {
    console.log('Logged book:', book);
  }

  logBooks(books: Book[]) {
    console.log(books);
  }

  showDetails(book: Book): void {
    this.router.navigate(['/books', book._id]);
  }

  search(): void {
    // Trim the search term and check if it's empty
    if (!this.searchTerm.trim()) {
      // If search term is empty, reset the list to show all books
      this.fetchBooks();
      return;
    }
  
    // Construct the URL with the search term, and include the userId query parameter if it exists
    const url = this.userId ? `http://localhost:3000/books/filter?title=${this.searchTerm}&userId=${this.userId}` : `http://localhost:3000/books/filter?title=${this.searchTerm}`;
    this.books$ = this.http.get<Book[]>(url);
  }
  

  toggleHeart(book: any): void {
    book.liked = !book.liked; // Toggle the liked state of the book

    this.bookService.likeBook(book._id, this.userId, book.liked).subscribe(
      (result) => {
        console.log(result);
        // Handle the result here, for example, navigate or perform any other action
       
      },
      (error) => {
        console.error('Error during like:', error);
        // Handle error
      }
    );
  }

  sendMessage (book: any): void {
    this.router.navigate(['/sendmessage'], {
      state: {
        bookId: book._id,
        owner: book.owner._id,
       // ownerUsername: book.owner.username,
       receiver: book.owner._id,
        sender: this.userId,
      }
    });
    
  }


//   getUserIdFromLocalStorage(): string {
//     const currentUserId = localStorage.getItem('userId');
//     console.log(currentUserId);
//     if (currentUserId != null) {
//       return currentUserId;
//     } else {
//       return '';
//     };
//   };
 }
