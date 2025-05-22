import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CountryService } from '../../../services/country.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CreateComponent implements OnInit {
  newPost = { title: '', content: '', country: '', date: '' };
  errorMessage: string | null = null;
  successMessage: string | null = null;
  countries: string[] = [];
  isLoading: boolean = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private countryService: CountryService
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    this.loadCountries();
  }

  loadCountries() {
    this.countryService.getCountries().subscribe({
      next: (data: any[]) => {
        this.countries = data.map(country => country.name);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load countries: ' + (err.error?.message || 'Unknown error');
        this.isLoading = false;
      }
    });
  }

  createPost() {
    const csrfToken = this.getCsrfToken();

    this.http.post(`${environment.apiUrl}/posts`, {
      title: this.newPost.title,
      content: this.newPost.content,
      country_name: this.newPost.country,
      visit_date: this.newPost.date
    }, {
      withCredentials: true,
      headers: { 'x-csrf-token': csrfToken }
    }).subscribe({
      next: () => {
        this.successMessage = 'Post created successfully!';
        this.errorMessage = null;
        this.newPost = { title: '', content: '', country: '', date: '' };
        setTimeout(() => this.router.navigate(['/profile']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to create post: ' + (err.error?.message || 'Unknown error');
        this.successMessage = null;
      }
    });
  }

  private getCsrfToken(): string {
    const name = 'csrf_token=';
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(name)) return c.substring(name.length);
    }
    return '';
  }
}
