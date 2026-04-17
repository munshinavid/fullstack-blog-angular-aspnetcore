import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogPostService } from '../../blogpost/services/blogpost-service';
import { BlogPost } from '../../blogpost/models/blogpost.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private blogService = inject(BlogPostService);

  // Signals for state
  posts = signal<BlogPost[]>([]);
  stats = signal<any>(null);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading.set(true);
    
    // ১. স্ট্যাটাস লোড করা
    this.blogService.getDashboardStats().subscribe({
      next: (res) => this.stats.set(res),
    });

    // ২. সব পোস্ট লোড করা (Admin version)
    this.blogService.getAllAdminBlogPosts('', 1, 50).subscribe({
      next: (response) => {
        this.posts.set(response.items);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onRestore(id: string) {
    if (confirm('Are you sure you want to restore this post?')) {
      this.blogService.restoreBlogPost(id).subscribe({
        next: () => {
          this.loadDashboardData(); // ডাটা রিফ্রেশ করা
        }
      });
    }
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogService.deleteBlogPost(id).subscribe({
        next: () => {
          this.loadDashboardData(); // ডাটা রিফ্রেশ করা
        }
      });
    }
  }
}