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
    // Clear authentication state
    this.authService.setAuthenticated(false);
    // Redirect to the login page or any other desired page
    this.router.navigate(['/home']);
  }

}
