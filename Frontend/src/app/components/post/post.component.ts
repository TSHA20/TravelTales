import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  imports: [CommonModule]
})
export class PostComponent {
  @Input() post: any;

  getImageUrl(post: any): string {
    return post.imageUrl || 'assets/default-post.jpg';
  }

  likePost(postId: number): void {
    console.log(`Liked post with ID: ${postId}`);
    // TODO: Call a like API or update post.likes
  }

  commentOnPost(postId: number): void {
    console.log(`Comment on post with ID: ${postId}`);
    // TODO: Navigate to comment section or open modal
  }
}
