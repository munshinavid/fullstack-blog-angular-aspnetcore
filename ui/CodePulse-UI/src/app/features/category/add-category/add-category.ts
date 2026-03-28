import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AddCategoryRequest } from '../models/category.model';
import { CategoryServices } from '../services/category-services';

@Component({
  selector: 'app-add-category',
  imports: [ReactiveFormsModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  categoryForm = new FormGroup({
    categoryName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(5)] }),
    categoryUrl: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
  });

  get categoryName() {
    return this.categoryForm.get('categoryName');
  }

  get categoryUrl() {
    return this.categoryForm.get('categoryUrl');
  }

  constructor(private categoryServices: CategoryServices) {}

  onSubmit() {
    if (this.categoryForm.valid) {
      const categoryData = this.categoryForm.getRawValue();
      console.log('Category Data:', categoryData);
      // Here you can add logic to send the data to your backend or service

      const AddCategoryRequest: AddCategoryRequest = {
        name: categoryData.categoryName,
        urlHandle: categoryData.categoryUrl
      }
      this.categoryServices.addCategory(AddCategoryRequest).subscribe({
        next: () => {
          console.log('Category added successfully');
          // Here you can add logic to navigate to another page or show a success message
        },
        error: (error) => {
          console.error('Error adding category:', error);
          // Here you can add logic to show an error message
        }
      });
    }
  }


}
