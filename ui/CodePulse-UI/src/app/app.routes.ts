import { Routes } from '@angular/router';
import { AddCategory } from './features/category/add-category/add-category';

export const routes: Routes = [
  {
    path: 'admin/categories',
    loadComponent: () => import('./features/category/category-list/category-list').then(m => m.CategoryList)
  },
  {
    path: 'admin/categories/add',
    component: AddCategory,
  }
];
