import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  recentPosts: any[] = [];
  popularPosts: any[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getRecentPosts().subscribe((data) => {
      this.recentPosts = data;
    });
    this.postService.getPopularPosts().subscribe((data) => {
      this.popularPosts = data;
    });
  }

  sortPosts(criteria: 'newest' | 'most-liked' | 'most-commented'): void {
    this.postService.getSortedPosts(criteria).subscribe((data) => {
      this.recentPosts = data;
    });
  }
}
