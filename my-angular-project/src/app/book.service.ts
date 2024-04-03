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

    addBook(formData: FormData): Observable<Book> {
        return this.http.post<Book>(`/api/books`, formData);
    }

    getBookById(id: string): Observable<Book> {
        return this.http.get<Book>(`${this.apiUrl}/books/${id}`);
    }

    deleteBook(id: string): Observable<Book> {
        return this.http.delete<Book>(`/api/books/${id}`);
    }

    editBook(id: string, formData: FormData): Observable<Book> {
        return this.http.put<Book>(`/api/books/${id}`, formData);
    }

    likeBook(bookId: string, ownerId: string, likes: boolean): Observable<string> {
        const body = {
            bookId: bookId,
            ownerId: ownerId,
            likes: likes
        };
    
        return this.http.put('/api/likes', body, { responseType: 'text' });
    }

    getLikedBooks(userId: string): Observable<Book[]> {
        const params = new HttpParams().set('userId', userId);

        return this.http.get<Book[]>(`/api/likes`, { params });
    }
}
