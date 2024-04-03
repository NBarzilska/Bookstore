// book-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service'; // Assuming you have a BookService to fetch book details
import { Book } from '../book-list/book-list.component'; // Assuming you have a Book model
import { Router } from '@angular/router'; // Import Router here
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book | undefined;
  isLoggedIn$: boolean = false; // store user login status
  userId: string = ''; // store current user's ID

  constructor(private route: ActivatedRoute, private bookService: BookService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.getBookDetails();
    this.isLoggedIn$ = this.authService.isLogged; // Check user login status
    this.userId = this.authService.getUserId(); // Get current user's ID
  }

  getBookDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    if (id) {
      this.bookService.getBookById(id).subscribe(book => {
        this.book = book;
        console.log(book);
      });
    }
  }

  logBook(book: any) {
    console.log('Logged book:', book);
  }

  editBook(book: Book): void {
    if (this.isLoggedIn$ && book.owner === this.userId) {
      this.router.navigate(['/books', book._id, 'edit']);
    } else {
    }
  }

  deleteBook(book: Book): void {
    if (this.isLoggedIn$ && book.owner === this.userId) {
      this.bookService.deleteBook(book._id).subscribe(
        (result) => {
          console.log(result);
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error deleting book:', error);
        }
      );} else {
        console.log('not logged or not owner but still seeing the delete button')
    }
  }
}
