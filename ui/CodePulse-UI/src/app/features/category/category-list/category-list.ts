import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryServices } from '../services/category-services';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {

  private categories = inject(CategoryServices);
  private categoryListRef = this.categories.getAllCategories();

  isLoading = this.categoryListRef.isLoading;
  isError = this.categoryListRef.error;
  categoryList = this.categoryListRef.value;

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categories.deleteCategory(id).subscribe({
        next: () => {
          // Refresh the category list after deletion
          this.categoryListRef.reload();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
        }
      });
    }
  }
  }
