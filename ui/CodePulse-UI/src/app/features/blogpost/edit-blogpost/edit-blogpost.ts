import { Component, ComponentRef, ViewChild, ViewContainerRef, inject, input, OnDestroy, OnInit, effect, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { BlogPostService } from '../services/blogpost-service';
import { CategoryServices } from '../../category/services/category-services';
import { UpdateBlogPostRequest } from '../models/blogpost.model';
import { ImageSelector } from '../../../shared/components/image-selector/image-selector';

@Component({
  selector: 'app-edit-blogpost',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgxEditorModule],
  templateUrl: './edit-blogpost.html',
  styleUrl: './edit-blogpost.css',
})
export class EditBlogpost implements OnInit, OnDestroy {
  // Input from Route Params
  id = input.required<string>();

  private blogPostService = inject(BlogPostService);
  private categoryService = inject(CategoryServices);
  private router = inject(Router);

  // Get Data using Resource/Signals (assuming your service uses signals)
  // your existing logic updated for reactive data fetching
  categoryList = this.categoryService.getAllCategories().value;
  
  // Local state
  editor!: Editor;
  isSubmitting = signal(false);
  selectedCategoryIds: string[] = [];
  @ViewChild('imageSelectorHost', { read: ViewContainerRef }) imageSelectorHost?: ViewContainerRef;
  private imageSelectorRef: ComponentRef<ImageSelector> | null = null;

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  updateBlogPostForm = new FormGroup({
    title: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    urlHandle: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    content: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    featuredImgUrl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    author: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    publishedDate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    isVisible: new FormControl<boolean>(true, { nonNullable: true })
  });

  blogPostRef = this.blogPostService.getBlogPostById(() => this.id());
  blogPost = this.blogPostRef.value;

  constructor() {
    // যখনই ডাটাবেস থেকে blogPost এর ডাটা আসবে, তখনই ফর্মটি ফিল-আপ হবে
    effect(() => {
      const data= this.blogPost();
      if (data) {
        this.updateBlogPostForm.patchValue({
          title: data.title,
          urlHandle: data.urlHandle,
          description: data.description,
          content: data.content,
          featuredImgUrl: data.featuredImgUrl,
          author: data.author,
          publishedDate: new Date(data.publishedDate).toISOString().split('T')[0],
          isVisible: data.isVisible
        });

        // আগে থেকে সিলেক্ট করা ক্যাটাগরি আইডিগুলো সেট করা
        if (data.categories) {
            this.selectedCategoryIds = data.categories.map(x => x.id.toString());
        }
      }
    });
  }

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onCategoryChange(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.checked) {
      this.selectedCategoryIds.push(element.value);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== element.value);
    }
  }

  onUpdateSubmit() {
    if (this.updateBlogPostForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.updateBlogPostForm.getRawValue();

    const updateRequest: UpdateBlogPostRequest = {
      title: formValue.title,
      urlHandle: formValue.urlHandle,
      description: formValue.description,
      content: formValue.content,
      featuredImgUrl: formValue.featuredImgUrl,
      author: formValue.author,
      publishedDate: new Date(formValue.publishedDate),
      isVisible: formValue.isVisible,
      categoryIds: this.selectedCategoryIds
    };

    this.blogPostService.updateBlogPost(this.id(), updateRequest).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/admin/blogposts']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error(err);
      }
    });
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogPostService.deleteBlogPost(this.id()).subscribe({
        next: () => this.router.navigate(['/admin/blogposts'])
      });
    }
  }

  onImgError(event: any) {
    event.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
  }

  openImageSelector() {
    if (!this.imageSelectorHost || this.imageSelectorRef) {
      return;
    }
    console.log('Opening image selector: url);');
    this.imageSelectorHost.clear();
    this.imageSelectorRef = this.imageSelectorHost.createComponent(ImageSelector);
    this.imageSelectorRef.instance.imageSelected.subscribe((url) => this.onImageSelected(url));
    this.imageSelectorRef.instance.closeModal.subscribe(() => this.closeImageSelector());
  }

  closeImageSelector() {
    this.imageSelectorRef?.destroy();
    this.imageSelectorRef = null;
    this.imageSelectorHost?.clear();
  }

  onImageSelected(url: string) {
    queueMicrotask(() => {
      this.updateBlogPostForm.controls.featuredImgUrl.setValue(url);
      this.closeImageSelector();
    });
  }
}