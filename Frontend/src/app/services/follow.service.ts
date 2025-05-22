import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({ providedIn: 'root' })
export class FollowService {
  constructor(private http: HttpClient) {}

  followUser(followingId: number) {
    return this.http.post(`${environment.apiUrl}/social/follow`, { followingId }, { withCredentials: true });
  }

  unfollowUser(followingId: number) {
    return this.http.post(`${environment.apiUrl}/social/unfollow`, { followingId }, { withCredentials: true });
  }

  getFollowing() {
    return this.http.get(`${environment.apiUrl}/social/following`, { withCredentials: true });
  }
}
