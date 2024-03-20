import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Book } from '../book-list/book-list.component';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  books$!: Observable<Book[]>;
  userId: string = '';
  
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Add any initialization logic here
    const userId = this.authService.getUserId();
    this.books$ = this.http.get<Book[]>(`http://localhost:3000/books/owner/${userId}`);
  }
  showDetails(book: Book): void {
    this.router.navigate(['/books', book._id]);
  }


}