/*
 * ============================================================
 *  Blog Details Component — Improvements #10, #11
 * ============================================================
 *  #10: Dynamic page title — sets browser tab to "Post Title | CodePulse"
 *  #11: Back to Top button — smooth scroll for long posts
 *
 *  Interview Tip: We use Angular's `effect()` to reactively update
 *  the page title whenever the blog post data changes. Unlike a
 *  one-time set in the constructor, effect() runs whenever any
 *  signal it reads changes — so the title updates as soon as
 *  the resource resolves.
 * ============================================================
 */
import { Component, input, inject, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../../blogpost/services/blogpost-service';
import { CommonModule } from '@angular/common';
import { CommentSection } from '../../comment/comment-section/comment-section';
// Improvement #10: Import Title service for dynamic browser tab title
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-details',
  imports: [CommonModule, RouterLink, CommentSection],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  // Route param — name must match the route param defined in app.routes.ts
  url = input<string | undefined>();

  private blogPostService = inject(BlogPostService);
  private titleService = inject(Title);

  blogPostResource = this.blogPostService.getBlogPostByUrlHandle(() => this.url());

  /*
   * Improvement #11: Track whether the "Back to Top" button should show.
   * It appears only when the user scrolls down past 300px.
   * This prevents the button from cluttering the view at the top.
   */
  showBackToTop = signal(false);

  constructor() {
    /*
     * Improvement #10: Reactively set the page title.
     * effect() watches all signals read inside it (blogPostResource.value())
     * and re-runs whenever any of them change. So when the API response
     * arrives, the tab title automatically updates to the post title.
     */
    effect(() => {
      const post = this.blogPostResource.value();
      if (post) {
        this.titleService.setTitle(`${post.title} | CodePulse`);
      }
    });

    /*
     * Improvement #11: Scroll event listener for "Back to Top" visibility.
     * We listen on the window scroll event and show the button when
     * the user has scrolled past 300px.
     *
     * Note: In a larger app, you might use a directive or HostListener
     * for this. For a single page, this is simpler and fine.
     */
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.showBackToTop.set(window.scrollY > 300);
      });
    }
  }

  /*
   * Improvement #11: Scrolls the page smoothly back to the top.
   * window.scrollTo with behavior:'smooth' works because we set
   * `scroll-behavior: smooth` on the html element in styles.css.
   */
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
