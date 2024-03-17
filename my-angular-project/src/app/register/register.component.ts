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

  register(username: string, password: string, email: string) {
    if (!username || !password || !email) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.authService.register(username, password, email).subscribe(response => {
      if (response.success) {
        console.log('Registration successful');
        this.router.navigate(['/login']);
      } else {
        this.errorMessage = response.message;
      }
    }, error => {
      console.error('Registration error:', error);
      this.errorMessage = 'An error occurred while registering.';
    });
  }
}
