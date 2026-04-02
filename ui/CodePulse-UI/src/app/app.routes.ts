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
  },
  {
    path: 'admin/categories/edit/:id',
    loadComponent: () => import('./features/category/edit-category/edit-category').then(m => m.EditCategory)
  },
  {
    path: 'admin/blogposts',
    loadComponent: () => import('./features/blogpost/blogpost-list/blogpost-list').then(m => m.BlogpostList)
  },
  {
    path: 'admin/blogposts/add',
    loadComponent: () => import('./features/blogpost/add-blogpost/add-blogpost').then(m => m.AddBlogPost)
  }
];
