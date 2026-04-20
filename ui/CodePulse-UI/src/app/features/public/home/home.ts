/*
 * ============================================================
 *  Home Component — Improvements #10, #12
 * ============================================================
 *  #10: Uses Angular's Title service to set a dynamic browser tab title.
 *  #12: The skeleton loading is template-only (no TS changes needed)
 *       because we reuse blogPostsResource.isLoading() which already existed.
 * ============================================================
 */
import { Component, inject, computed, signal } from '@angular/core';
import { BlogPostService } from '../../blogpost/services/blogpost-service';
import { DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
// Improvement #10: Import Title service for dynamic browser tab title
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, SlicePipe, RouterLink],
  templateUrl: './home.html',
  // Link the CSS file so Angular scopes these styles to this component
  styleUrl: './home.css',
})
export class Home {

  private blogPostService = inject(BlogPostService);

  // Improvement #10: Set browser tab title for SEO and usability.
  // When someone has multiple tabs open, a descriptive title helps them
  // find your page. Also, search engines use <title> as the main heading
  // in search results.
  private titleService = inject(Title);

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

  constructor() {
    // Improvement #10: Set the page title on initialization
    this.titleService.setTitle('Navid Munshi');
  }
}