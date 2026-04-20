import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BlogPostService } from '../services/blogpost-service';
import { CategoryServices } from '../../category/services/category-services';
import { CreateBlogPostRequest } from '../models/blogpost.model';
import { ImageSelector } from '../../../shared/components/image-selector/image-selector';

@Component({
  selector: 'app-add-blogpost',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, ImageSelector],
  templateUrl: './add-blogpost.html',
  styleUrl: './add-blogpost.css'
})
export class AddBlogPost {
  
  private blogPostService = inject(BlogPostService);
  private categoryService = inject(CategoryServices);
  private router = inject(Router);
  selectedCategoryIds: string[] = [];
  showImageSelector = signal(false);

  categoryRessourceRef = this.categoryService.getAllCategories();
  categoryList = this.categoryRessourceRef.value

  // Handle broken image preview
  onImgError(event: any) {
    event.target.src = 'https://placehold.co/400x200/1a1a3e/818cf8?text=Invalid+URL';
  }

  openImageSelector() {
    this.showImageSelector.set(true);
  }

  closeImageSelector() {
    this.showImageSelector.set(false);
  }

  onImageSelected(url: string) {
    this.addBlogPostForm.controls.featuredImgUrl.setValue(url);
    this.showImageSelector.set(false);
  }

  isSubmitting = signal(false);

  addBlogPostForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    urlHandle: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    featuredImgUrl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    author: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    publishedDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    isVisible: new FormControl<boolean>(true, { nonNullable: true })
  });

  onSubmit() {
    if (this.addBlogPostForm.invalid) return;

    this.isSubmitting.set(true);
    const data = this.addBlogPostForm.getRawValue();

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

    this.blogPostService.createBlogPost(newBlogPost).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/blogposts']);
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
      this.selectedCategoryIds.push(categoryId);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }
  }
}