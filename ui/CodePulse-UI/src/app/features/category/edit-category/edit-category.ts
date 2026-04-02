import { Component, effect, inject, input, signal } from '@angular/core';
import { CategoryServices } from '../services/category-services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateCategoryRequest } from '../models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.css',
})
export class EditCategory {
  id= input<string>();
  private router = inject(Router); // ২. রাউটার ইনজেক্ট করুন

  private categoryServices = inject(CategoryServices);
  private categoryRef = this.categoryServices.getCategoryById(this.id);

  isLoading = this.categoryRef.isLoading;
  isError = this.categoryRef.error;
  categoryRefValue = this.categoryRef.value;

  editCategoryForm = new FormGroup({
    categoryName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(20)] }),
    categoryUrl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
  });

  get categoryName() {
    return this.editCategoryForm.get('categoryName');
  }

  get categoryUrl() {
    return this.editCategoryForm.get('categoryUrl');
  }

  effectRef= effect(() => {
    const data = this.categoryRefValue();
    if (data) {
      this.editCategoryForm.patchValue({
        categoryName: data.name,
        categoryUrl: data.urlHandle
      });
    }
  });

  isUpdating=signal(false);
  onSubmit() {
    const id= this.id();
    const data = this.editCategoryForm.getRawValue();
    console.log('Form Submitted', this.editCategoryForm.getRawValue());
    // Here you can add logic to send the updated data to your backend or service
    const updateCategoryRequest: UpdateCategoryRequest = {
      name: data.categoryName,
      urlHandle: data.categoryUrl
    }
    if (id) {
      this.isUpdating.set(true);
      this.categoryServices.updateCategory(id, updateCategoryRequest).subscribe({
        next: () => {
          this.isUpdating.set(false);
          console.log('Category updated successfully');
          // Here you can add logic to navigate to another page or show a success message
          this.router.navigate(['/admin/categories']);
        },
        error: (error) => {
          console.error('Error updating category:', error);
          // Here you can add logic to show an error message
          this.isUpdating.set(false);
        }
      });

    }

  }

}
