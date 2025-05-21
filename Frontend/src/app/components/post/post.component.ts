import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  standalone: true,
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
  imports: [CommonModule]
})
export class PostComponent {
  @Input() post: any;

  private postService = inject(PostService);

  getImageUrl(post: any): string {
    return post.imageUrl || 'assets/colombo.webp';
  }

  likePost(postId: number): void {
    this.postService.likePost(postId).subscribe({
      next: () => {
        console.log(`Liked post with ID: ${postId}`);
        if (this.post && this.post.id === postId) {
          this.post.likes = (this.post.likes || 0) + 1;
        }
      },
      error: (err) => {
        console.error('Error liking post:', err);
      }
    });
  }

  commentOnPost(postId: number): void {
    console.log(`Comment on post with ID: ${postId}`);
    // TODO: Navigate to comment section or open modal
  }
}
