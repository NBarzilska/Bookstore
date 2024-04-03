// register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  errorMessage!: string;

  constructor(private authService: AuthService, private router: Router) { }

  // Custom validator for username
  validateUsername(username: string) {
    const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    if (!usernameRegex.test(username)) {
      return false;
    }
    return true;
  }

  // Custom validator for password
  validatePassword(password: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return false;
    }
    return true;
  }

  // Custom validator for email
  validateEmail(email: string) {
    //includes lowercase, uppercase, numbers, and special characters
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    if (!emailRegex.test(email)) {
      return false;
    }
    return true;
  }

  register(username: string, password: string, email: string) {
    if (!username || !password || !email) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const isValidUsername = this.validateUsername(username);
    const isValidPassword = this.validatePassword(password);
    const isValidEmail = this.validateEmail(email);

    if (isValidUsername != true) {
      this.errorMessage = 'Username doesn`t fit the requirements. It should be at least 8 charactes long, containing only letters and digits!';
      return;
    }

    if (isValidPassword != true) {
      this.errorMessage = 'Password doesn`t fit the requirements. It should be at least 8 charactes long, containing at least 1 small letter, 1 capital letter, 1 special character and 1 digit!';
      return;
    }

    if (isValidEmail != true) {
      this.errorMessage = 'Email is not valid!';
      return;
    }

    this.authService.register(username, password, email).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration error:', error);
        // The server response (in case of an error like duplicate entry) will be in error.error
        this.errorMessage = error.error.message || 'An unexpected error occurred';
      }
    });
  }
}
