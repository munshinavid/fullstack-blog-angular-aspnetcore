import { Component, inject } from '@angular/core';
import { BlogPostService } from '../services/blogpost-service';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-blogpost-list',
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './blogpost-list.html',
  styleUrl: './blogpost-list.css',
})
export class BlogpostList {
  private blogPostService = inject(BlogPostService);

  // ১. httpResource ব্যবহার করে ডাটা ফেচ করা
  private blogPostRef = this.blogPostService.getAllBlogPosts();

  // ২. রিসোর্স থেকে সিগন্যালগুলো আলাদা করা (HTML-এ ব্যবহারের জন্য)
  blogPostList = this.blogPostRef.value;
  isLoading = this.blogPostRef.isLoading;
  isError = this.blogPostRef.error;

  // ৩. ডিলিট মেথড
  deleteBlogPost(id: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogPostService.deleteBlogPost(id).subscribe({
        next: () => {
          // ৪. ডিলিট সফল হলে লিস্টটি রিলোড করা
          this.blogPostRef.reload();
          console.log('Post deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting post:', err);
          alert('Failed to delete the post. Please try again.');
        }
      });
    }
  }

}
