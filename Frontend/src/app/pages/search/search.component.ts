import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { PostComponent } from '../../components/post/post.component';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [CommonModule, FormsModule, PostComponent]
})
export class SearchComponent implements OnInit {
  country = '';
  username = '';
  countries: string[] = [];
  posts: any[] = [];
  isLoading = false;
  noResults = false;

  constructor(
      private postService: PostService,
      private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.countryService.getCountries().subscribe({
      next: (data: any[]) => {
        this.countries = data.map(c => c.name);
      },
      error: (err) => {
        console.error('Failed to load countries:', err);
      }
    });
  }

  search(): void {
    this.isLoading = true;
    this.postService.getPosts(this.country, this.username).subscribe({
      next: (data) => {
        this.posts = data;
        this.noResults = data.length === 0;
        this.isLoading = false;
      },
      error: () => {
        this.posts = [];
        this.noResults = true;
        this.isLoading = false;
      }
    });
  }

  clear(): void {
    this.country = '';
    this.username = '';
    this.posts = [];
    this.noResults = false;
  }
}
