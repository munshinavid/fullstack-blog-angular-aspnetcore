import { Component, input, inject, signal, effect, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPostService } from '../../blogpost/services/blogpost-service';
import { CommonModule } from '@angular/common';
import { CommentSection } from '../../comment/comment-section/comment-section';
import { Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-blog-details',
  imports: [CommonModule, RouterLink, CommentSection],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  url = input<string | undefined>();

  private blogPostService = inject(BlogPostService);
  private titleService = inject(Title);
  private sanitizer = inject(DomSanitizer);

  blogPostResource = this.blogPostService.getBlogPostByUrlHandle(() => this.url());

  showBackToTop = signal(false);

  // Convert raw markdown content to safe HTML for rendering
  renderedContent = computed<SafeHtml>(() => {
    const post = this.blogPostResource.value();
    if (!post?.content) return '';
    const rawHtml = marked.parse(post.content) as string;
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  });

  constructor() {
    // Set browser tab title when post loads
    effect(() => {
      const post = this.blogPostResource.value();
      if (post) {
        this.titleService.setTitle(`${post.title} | CodePulse`);
      }
    });

    // Show back-to-top after scrolling 300px
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.showBackToTop.set(window.scrollY > 300);
      });
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
