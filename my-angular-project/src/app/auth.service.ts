import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; // Your Node.js backend URL
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if the user is authenticated on application initialization
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { username, password });
  }

  register(username: string, password: string, email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, { username, password, email });
  }

  setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
    // Save authentication state to localStorage
    localStorage.setItem('isAuthenticated', String(isAuthenticated));
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getUserId(): string {
    // Assuming you have a user object stored in localStorage after login
    const userString = localStorage.getItem('user');
    
    // Check if userString is not null
    if (userString !== null) {
      const user = JSON.parse(userString);
      
      // Check if user.id is a string
      if (typeof user.id === 'string') {
        return user.id;
      }
    }
    
    // Return default value if user id is not found
    return '65f706dca8e3f1b72cf0876f';
  }
}
