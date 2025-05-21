import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  user: any = {};
  posts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found, user might not be logged in');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(`${environment.apiUrl}/auth/me`, { headers }).subscribe({
      next: (res: any) => {
        this.user = res;
        this.loadUserPosts(headers);
      },
      error: (err) => {
        console.error('Failed to load user info:', err);
      }
    });
  }

  loadUserPosts(headers: HttpHeaders): void {
    this.http.get<any[]>(`${environment.apiUrl}/posts/my`, { headers }).subscribe({
      next: (data) => {
        this.posts = data.map(post => ({
          ...post,
          likes: post.likes || 0,
          comments: post.comments || 0
        }));
        console.log('Loaded posts:', this.posts);
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
      }
    });
  }
}
