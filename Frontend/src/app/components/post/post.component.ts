import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { FollowService } from '../../services/follow.service';

@Component({
  selector: 'app-post',
  standalone: true,
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  imports: [CommonModule]
})
export class PostComponent implements OnInit {
  @Input() post: any;
  isFollowing: boolean = false;
  currentUserId: number | null = null;

  private postService = inject(PostService);
  private followService = inject(FollowService);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/auth/me`, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.currentUserId = res.id;
      },
      error: () => {
        console.warn('Unable to load current user ID');
      }
    });
  }

  follow(userId: number) {
    if (this.currentUserId === userId) return; // to stop following themself

    this.followService.followUser(userId).subscribe(() => {
      this.isFollowing = true;
    });
  }

  unfollow(userId: number) {
    if (this.currentUserId === userId) return; // to stop following themself

    this.followService.unfollowUser(userId).subscribe(() => {
      this.isFollowing = false;
    });
  }

  likePost(postId: number): void {
    const csrfToken = this.getCsrfToken();

    this.http.post(`${environment.apiUrl}/posts/like/${postId}`, {}, {
      withCredentials: true,
      headers: {
        'x-csrf-token': csrfToken
      }
    }).subscribe({
      next: (res: any) => {
        if (this.post && this.post.id === postId) {
          this.post.likes = (this.post.likes || 0) + 1;
        }
      },
      error: (err: any) => {
        console.error('Error liking post:', err);
      }
    });
  }

  unlikePost(postId: number): void {
    const csrfToken = this.getCsrfToken();

    this.http.post(`${environment.apiUrl}/posts/unlike/${postId}`, {}, {
      withCredentials: true,
      headers: {
        'x-csrf-token': csrfToken
      }
    }).subscribe({
      next: (res: any) => {
        console.log('Unliked post:', res);
        if (this.post && this.post.id === postId) {
          this.post.likes = Math.max((this.post.likes || 1) - 1, 0);
        }
      },
      error: (err: any) => {
        console.error('Error unliking post:', err);
      }
    });
  }

  commentOnPost(postId: number): void {
    const comment = prompt('Enter your comment:');
    const csrfToken = this.getCsrfToken();

    if (!comment || !comment.trim()) return;

    this.http.post(`${environment.apiUrl}/posts/comment/${postId}`, {
      comment: comment.trim()
    }, {
      withCredentials: true,
      headers: {
        'x-csrf-token': csrfToken
      }
    }).subscribe({
      next: (res: any) => {
        if (this.post && this.post.id === postId) {
          this.post.comments = (this.post.comments || 0) + 1;
        }
      },
      error: (err) => {
        console.error('Error commenting on post:', err);
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
