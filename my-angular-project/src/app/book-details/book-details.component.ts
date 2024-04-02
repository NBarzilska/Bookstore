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
  isLoggedIn$: boolean = false; // Variable to store user login status
  userId: string = ''; // Variable to store current user's ID

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
      // Navigate to the edit route with book id as parameter
      this.router.navigate(['/books', book._id, 'edit']);
    } else {
      // Redirect to login page or display a message for unauthorized access
    }
  }

  deleteBook(book: Book): void {
    if (this.isLoggedIn$ && book.owner === this.userId) {
      this.bookService.deleteBook(book._id).subscribe(
        (result) => {
          console.log(result);
          // Handle the result here, for example, navigate or perform any other action
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error deleting book:', error);
          // Handle error
        }
      );} else {
        console.log('not logged or not owner but still seeing the delete button')
    }
  }
}
