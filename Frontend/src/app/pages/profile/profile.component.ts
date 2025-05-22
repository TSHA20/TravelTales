import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ProfileComponent implements OnInit {
  user: any = {};
  posts: any[] = [];
  selectedPostId: number | '' = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/auth/profile`, {
      withCredentials: true
    }).subscribe({
      next: (res: any) => {
        this.user = res;
        this.loadUserPosts();
      },
      error: (err) => {
        console.error('Failed to load user info:', err);
      }
    });
  }

  loadUserPosts(): void {
    this.http.get<any[]>(`${environment.apiUrl}/posts/my`, {
      withCredentials: true,
      headers: { 'x-csrf-token': this.getCsrfToken() }
    }).subscribe({
      next: (data) => {
        this.posts = data;
        console.log('Loaded posts:', this.posts);
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
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

  deletePost(postId: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const csrfToken = this.getCsrfToken();

    this.http.delete(`${environment.apiUrl}/posts/${postId}`, {
      withCredentials: true,
      headers: {
        'x-csrf-token': csrfToken
      }
    }).subscribe({
      next: () => {
        alert('Post deleted successfully.');
        window.location.reload();
      },
      error: (err) => {
        console.error('Error deleting post:', err);
        alert('Failed to delete post.');
      }
    });
  }
}
