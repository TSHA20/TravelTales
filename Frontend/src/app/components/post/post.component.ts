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
}
