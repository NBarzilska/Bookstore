import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  errorMessage!: string;

  constructor(private authService: AuthService, private router: Router) { }

  login(username: string, password: string) {
    this.authService.login(username, password).subscribe(response => {
      if (response.success) {
        console.log('Login successful');
        this.authService.setAuthenticated(true); // Set authentication state to true
        this.router.navigate(['/home']);
      } else {
        console.error('Login failed:', response.message);
        this.errorMessage = response.message; // Assign error message
      }
    }, error => {
      console.error('Login error:', error);
      this.errorMessage = 'An error occurred while logging in.';
    });
  }
}
