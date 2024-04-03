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
    this.logout();
  }

  logout() {
    console.log("logout component");
   // localStorage.setItem('userId', '');
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logged out successfully', response);
        this.router.navigate(['/home']);

      },
      error: (error) => {
        console.error('Logout failed', error);
      }
    });
  }

}
