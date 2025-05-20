import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../../components/post/post.component';
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

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data: any[]) => {
        // Map posts to include default likes and comments
        this.allPosts = data.map(post => ({
          ...post,
          likes: post.likes || 0,
          comments: post.comments || 0
        }));

        // Recent posts latest posts ordered by created at
        this.recentPosts = [...this.allPosts];

        // Popular posts sort by likes and take top 5
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
    // Sorting until backend supports /sorted
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
