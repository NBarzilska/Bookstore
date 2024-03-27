// book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book-list/book-list.component';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    addBook(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/books`, formData);
    }
    getBookById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/books/${id}`);
    }

    deleteBook(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/books/${id}`);
    }

    editBook(id: string, formData: FormData): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/books/${id}`, formData);
    }

    likeBook(bookId: string, ownerId: string, likes: boolean) {
        const body = {
            bookId: bookId,
            ownerId: ownerId,
            likes: likes
        };

        return this.http.put<any>(`${this.apiUrl}/likes`, body);
    }

    getLikedBooks(userId: string): Observable<Book[]> {
        // Append the userId as a query parameter
        const params = new HttpParams().set('userId', userId);
      
        return this.http.get<Book[]>(`${this.apiUrl}/likes`, { params });
      }
    
    }
