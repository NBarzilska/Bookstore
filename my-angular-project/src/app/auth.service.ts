import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription, tap , throwError } from 'rxjs';
//import { map } from 'rxjs/operators';
import { catchError,  map } from 'rxjs/operators';
import { UserForAuth } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private baseUrl = 'http://localhost:3000'; // Your Node.js backend URL
  // private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  // isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  user: UserForAuth | undefined | null;
  USER_KEY = '[user]';

  private user$$ = new BehaviorSubject<UserForAuth | undefined | null>(null);
  private user$ = this.user$$.asObservable();

  userSubscription!: Subscription;

  constructor(private http: HttpClient) {
    this.userSubscription = this.user$.subscribe((user) => {
      this.user = user;
    });
  }


  login(username: string, password: string) {
    return this.http
      .post<UserForAuth>(`${this.baseUrl}/login`, { username, password }, { observe: 'response' })
      .pipe(
        map(response => {
          if (response.status === 200) {
            // Assuming the response body contains the user data on successful login
            const user = response.body;
            this.user$$.next(user); // Update your user state
            console.log(user);
            console.log(this.user);
            console.log(this.user$$);
            return user; // You might adjust what's returned based on your needs
          } else {
            // Handle unexpected status codes as error conditions
            throw new Error('Login failed due to unexpected server response.');
          }
        }),
        catchError(error => {
          // Optionally, extract and handle specific error messages from the server response
          const errorMsg = error.error?.message || 'Login failed. Please check your credentials and try again.';
          console.error('Login error:', error);
          return throwError(() => new Error(errorMsg));
        })
      );
  }

  register(username: string, password: string, email: string) {
    return this.http
      .post<UserForAuth>(`${this.baseUrl}/register`, { username, password, email })
      .pipe(
        tap((user) => this.user$$.next(user)), // Perform side effect
        catchError((error) => {
          // Handle error
          console.error('Registration error:', error);
          return throwError(error); // Rethrow the error to propagate it to the subscriber
        })
      );
  }
 
  get isLogged(): boolean {
    return !!this.user;
  }

  

  isAuthenticated(): Observable<boolean> {
    return this.user$$.asObservable().pipe(
      map(user => !!user) // Convert user object presence to a boolean
    );
  }

  logout() {
    console.log('logout service');
    return this.http
      .post(`/api/logout`, {})
      .pipe(tap(() => this.user$$.next(undefined)));
  }

  getUserId(): string {
    return this.user ? this.user._id : '';
  }

  getProfile() {
    console.log("getProfile");
    return this.http
      .get<UserForAuth>(`/api/profile`)
      .pipe(tap((user) => this.user$$.next(user)));
  }


    ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
