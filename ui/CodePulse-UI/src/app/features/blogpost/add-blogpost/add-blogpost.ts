import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BlogPostService } from '../services/blogpost-service';
import { CreateBlogPostRequest } from '../models/blogpost.model';

@Component({
  selector: 'app-add-blogpost',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css'
})
export class AddBlogPost {
  private blogPostService = inject(BlogPostService);
  private router = inject(Router);

  // বাটন লোডিং স্টেট হ্যান্ডেল করার জন্য
  isSubmitting = signal(false);

  // FormGroup এবং FormControl সেটআপ
  addBlogPostForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    urlHandle: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    featuredImgUrl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    author: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    publishedDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    isVisible: new FormControl<boolean>(true, { nonNullable: true }) // ডিফল্টভাবে True (Public) থাকবে
  });

  onSubmit() {
    if (this.addBlogPostForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    const data = this.addBlogPostForm.getRawValue();

    // DTO এর সাথে ডাটা ম্যাপ করা (Date টাকে স্ট্রিং থেকে Date অবজেক্টে কনভার্ট করা হয়েছে)
    const newBlogPost: CreateBlogPostRequest = {
      title: data.title,
      urlHandle: data.urlHandle,
      description: data.description,
      content: data.content,
      featuredImgUrl: data.featuredImgUrl,
      author: data.author,
      publishedDate: new Date(data.publishedDate), 
      isVisible: data.isVisible
    };

    // API Call
    this.blogPostService.createBlogPost(newBlogPost).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/blogposts']); // সেভ হওয়ার পর লিস্টে চলে যাবে
      },
      error: (error) => {
        this.isSubmitting.set(false);
        console.error('Error creating blog post:', error);
      }
    });
  }
}