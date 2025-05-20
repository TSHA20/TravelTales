import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, HttpClientModule, PostComponent]
})
export class HomeComponent implements OnInit {
  recentPosts: any[] = [];
  popularPosts: any[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getRecentPosts().subscribe({
      next: (data) => {
        this.recentPosts = data;
      },
      error: (err) => {
        console.error('Error fetching recent posts:', err);
      }
    });
    this.postService.getPopularPosts().subscribe({
      next: (data) => {
        this.popularPosts = data;
      },
      error: (err) => {
        console.error('Error fetching popular posts:', err);
      }
    });
  }

  sortPosts(criteria: 'newest' | 'most-liked' | 'most-commented'): void {
    this.postService.getSortedPosts(criteria).subscribe({
      next: (data) => {
        this.recentPosts = data;
      },
      error: (err) => {
        console.error('Error sorting posts:', err);
      }
    });
  }
}
