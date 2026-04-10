import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BlogPostService } from '../services/blogpost-service';
import { CategoryServices } from '../../category/services/category-services';
import { CreateBlogPostRequest } from '../models/blogpost.model';
import { MarkdownComponent } from 'ngx-markdown';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-add-blogpost',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,NgxEditorModule],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css'
})
export class AddBlogPost implements OnInit, OnDestroy {
  
  private blogPostService = inject(BlogPostService);
  private categoryService = inject(CategoryServices);
  private router = inject(Router);
  selectedCategoryIds: string[] = [];

  categoryRessourceRef = this.categoryService.getAllCategories();
  categoryList = this.categoryRessourceRef.value

//ngOnInit এবং ngOnDestroy লাইফসাইকেল হ্যান্ডলার (যদি প্রয়োজন হয়)
// টুলবারে কি কি বাটন থাকবে তা সেট করা
  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  ngOnInit(): void {
    this.editor = new Editor(); // এডিটর ইনিশিয়ালাইজ করা
  }

  // মেমোরি লিক বন্ধ করতে ডিস্ট্রয় করা জরুরি
  ngOnDestroy(): void {
    this.editor.destroy();
  }

  // তোমার ক্লাসের ভেতরে এটি যোগ করো
  onImgError(event: any) {
    // যদি ইমেজ লোড হতে না পারে, তবে একটি প্লেসহোল্ডার ইমেজ সেট করে দেবে
    event.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
  }


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
      isVisible: data.isVisible,
      categoryIds: this.selectedCategoryIds
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

  onCategoryChange($event: Event) {
    const element = $event.target as HTMLInputElement;
  const categoryId = element.value;

  if (element.checked) {
    // যদি চেক করা হয়, তবে লিস্টে অ্যাড করো
    this.selectedCategoryIds.push(categoryId);
    //show in console
    console.log('Selected Categories:', this.selectedCategoryIds);
  } else {
    // যদি আন-চেক করা হয়, তবে লিস্ট থেকে সরিয়ে দাও
    this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
  }
  }
}