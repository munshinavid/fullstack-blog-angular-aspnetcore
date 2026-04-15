import { Component, inject, computed } from '@angular/core';
import { BlogPostService } from '../../blogpost/services/blogpost-service';
import { DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, SlicePipe,RouterLink],
  templateUrl: './home.html',
})
export class Home {

  private blogPostService = inject(BlogPostService);

  // 🔥 resource (auto fetch + reactive)
  blogPostsResource = this.blogPostService.getAllBlogPosts();

  // 🔥 filter only visible posts
  visibleBlogs = computed(() =>
    this.blogPostsResource.value()?.filter(x => x.isVisible) ?? []
  );
}