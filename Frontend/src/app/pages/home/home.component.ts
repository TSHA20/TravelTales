import {Component, Input, OnInit} from '@angular/core';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, PostComponent]
})
export class HomeComponent implements OnInit {
  recentPosts: any[] = [];
  popularPosts: any[] = [];
  allPosts: any[] = [];

  @Input() user: any;
  username: string = '';

  constructor(
    private postService: PostService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadPosts();
  }

  loadUser(): void {
    this.http.get<{ username: string }>('http://localhost:3000/api/auth/me', { withCredentials: true })
      .subscribe({
        next: (data) => {
          this.username = data.username;
        },
        error: (err) => {
          console.error('Failed to load user info', err);
        }
      });
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data: any[]) => {
        this.allPosts = data.map(post => ({
          ...post,
          likes: post.likes || 0,
          comments: post.comments || 0
        }));

        this.recentPosts = [...this.allPosts];

        this.popularPosts = [...this.allPosts]
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 5);
      },
      error: (err: any) => {
        console.error('Error fetching posts:', err);
        this.recentPosts = [];
        this.popularPosts = [];
        this.allPosts = [];
      }
    });
  }

  sortPosts(criteria: 'newest' | 'most-liked' | 'most-commented'): void {
    let sortedPosts = [...this.allPosts];
    if (criteria === 'newest') {
      this.recentPosts = sortedPosts;
    } else if (criteria === 'most-liked') {
      this.recentPosts = sortedPosts.sort((a, b) => b.likes - a.likes);
    } else if (criteria === 'most-commented') {
      this.recentPosts = sortedPosts.sort((a, b) => b.comments - a.comments);
    }
  }
}
