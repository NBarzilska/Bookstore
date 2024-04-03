import { Component, OnInit , OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , Subscription } from 'rxjs';
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
export class BookListComponent implements OnInit, OnDestroy  {
  searchTerm: string = '';
  books$!: Observable<Book[]>;
  isLoggedIn: boolean = false;
  userId: string = '';

  private authStatusSub!: Subscription;

  constructor(private http: HttpClient, private authService: AuthService, private bookService: BookService, private router: Router) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isLoggedIn = isAuthenticated;
      if (isAuthenticated) {
        this.userId = this.authService.getUserId();
        this.fetchBooks();
      }else{
        this.fetchBooks();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe(); // Unsubscribe from authentication status subscription
    }
  }

  fetchBooks(): void {
    // Append the userId as a query parameter if it exists, otherwise, fetch without userId
    const url = this.userId ? `http://localhost:3000/books?userId=${this.userId}` : 'http://localhost:3000/books';
    this.books$ = this.http.get<Book[]>(url);
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
    if (!this.searchTerm.trim()) {
      // If search term is empty, reset the list to show all books
      this.fetchBooks();
      return;
    }
  
    const url = this.userId ? `http://localhost:3000/books/filter?title=${this.searchTerm}&userId=${this.userId}` : `http://localhost:3000/books/filter?title=${this.searchTerm}`;
    this.books$ = this.http.get<Book[]>(url);
  }
  

  toggleHeart(book: any): void {
    book.liked = !book.liked; // Toggle the liked state of the book

    this.bookService.likeBook(book._id, this.userId, book.liked).subscribe(
      (result) => {
        console.log(result);       
      },
      (error) => {
        console.error('Error during like:', error);
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

 }
