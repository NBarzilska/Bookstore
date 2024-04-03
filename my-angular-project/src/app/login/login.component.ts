import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage!: string;
  loginForm!: FormGroup;

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


  login(username: string, password: string) {
    if (!username || !password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    const isValidUsername = this.validateUsername(username);
    const isValidPassword = this.validatePassword(password);

    if (isValidUsername != true) {
      this.errorMessage = 'Invalid username!';
      return;
    }

    if (isValidPassword != true) {
      this.errorMessage = 'Invalid password!';
      return;
    }

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log(response);
        if (response) {
          console.log('Login successful');
          const userId = response._id;
          console.log('User ID:', userId);
  
         // localStorage.setItem('userId', userId);
  
          this.router.navigate(['/home']);
        } else {
          this.errorMessage =  'Unknown error occurred';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error.message || 'Unknown error occurred';
      }
    });
  }
}
