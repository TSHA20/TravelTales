import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  getRecentPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent`);
  }

  getPopularPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/popular`);
  }

  getSortedPosts(criteria: 'newest' | 'most-liked' | 'most-commented'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sorted?criteria=${criteria}`);
  }
}
