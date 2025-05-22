import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
