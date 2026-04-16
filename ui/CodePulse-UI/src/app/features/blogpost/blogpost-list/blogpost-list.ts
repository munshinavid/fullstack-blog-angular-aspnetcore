import { Component, inject, signal, computed } from '@angular/core';
import { BlogPostService } from '../services/blogpost-service';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blogpost-list',
  imports: [RouterLink, CommonModule, DatePipe, FormsModule],
  templateUrl: './blogpost-list.html',
  styleUrl: './blogpost-list.css',
})
export class BlogpostList {
private blogPostService = inject(BlogPostService);

searchQuery = signal('');
currentPage = signal(1);
pageSize = signal(5);

// ১. httpResource ব্যবহার করে ডাটা ফেচ করা
private blogPostRef = this.blogPostService.getAllBlogPosts(this.searchQuery, this.currentPage, this.pageSize);

// ২. রিসোর্স থেকে সিগন্যালগুলো আলাদা করা (HTML-এ ব্যবহারের জন্য)
pagedResult = this.blogPostRef.value;
isLoading = this.blogPostRef.isLoading;
isError = this.blogPostRef.error;

onSearchChange(event: any) {
  this.searchQuery.set(event.target.value);
  this.currentPage.set(1);
}

nextPage() {
  const result = this.pagedResult();
  if (result && (this.currentPage() * this.pageSize()) < result.totalCount) {
    this.currentPage.set(this.currentPage() + 1);
  }
}

prevPage() {
  if (this.currentPage() > 1) {
    this.currentPage.set(this.currentPage() - 1);
  }
}

hasNextPage = computed(() => {
  const result = this.pagedResult();
  if (!result) return false;
  return (this.currentPage() * this.pageSize()) < result.totalCount;
});

// ৩. ডিলিট মেথড
deleteBlogPost(id: string) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogPostService.deleteBlogPost(id).subscribe({
        next: () => {
          // ৪. ডিলিট সফল হলে লিস্টটি রিলোড করা
          this.blogPostRef.reload();
          console.log('Post deleted successfully');
        },
        error: (err: any) => {
          console.error('Error deleting post:', err);
          alert('Failed to delete the post. Please try again.');
        }
      });
    }
  }

}
