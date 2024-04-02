import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {

  constructor(private authService: AuthService, private router: Router) {
  }

  get isLoggedIn(): boolean {
    return this.authService.isLogged;
  }

  login() {
    this.router.navigate(['/login']);
  }
}
