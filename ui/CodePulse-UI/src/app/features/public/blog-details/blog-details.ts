import { Component, input,inject } from '@angular/core';
import { withComponentInputBinding, RouterLink } from '@angular/router';
import { BlogPostService } from '../../blogpost/services/blogpost-service';
import { CommonModule } from '@angular/common';
import { CommentSection } from '../../comment/comment-section/comment-section';

@Component({
  selector: 'app-blog-details',
  imports: [CommonModule, RouterLink, CommentSection],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  //name should be same as the route param defined in app.routes.ts
  url=input<string | undefined>();

  blogPostService = inject(BlogPostService);

  blogPostResource = this.blogPostService.getBlogPostByUrlHandle(() => this.url());

}
