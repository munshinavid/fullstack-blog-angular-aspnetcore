import { Component, inject, computed, signal } from '@angular/core';
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
  private searchQuery = signal('');
  private currentPage = signal(1);
  private pageSize = signal(50);

  // Fetch first page with a large page size for the public home feed.
  blogPostsResource = this.blogPostService.getAllBlogPosts(
    this.searchQuery,
    this.currentPage,
    this.pageSize
  );

  // Filter only visible posts from paged response.
  visibleBlogs = computed(() =>
    this.blogPostsResource.value()?.items.filter((x) => x.isVisible) ?? []
  );
}