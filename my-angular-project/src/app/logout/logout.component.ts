import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Call logout method when the component initializes
    this.logout();
  }

  logout() {
    console.log("logout component");
   // localStorage.setItem('userId', '');
    // Clear authentication state
    this.authService.logout().subscribe({
      next: (response) => {
        // Handle successful logout
        console.log('Logged out successfully', response);
        this.router.navigate(['/home']);

      },
      error: (error) => {
        // Handle error on logout
        console.error('Logout failed', error);
      }
    });
  }

}
