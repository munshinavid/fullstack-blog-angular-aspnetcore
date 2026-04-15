import { Routes } from '@angular/router';
import { AddCategory } from './features/category/add-category/add-category';
import { Home } from './features/public/home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'blog/:url',
    loadComponent: () => import('./features/public/blog-details/blog-details').then(m => m.BlogDetails)
  },
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
  },
  {
    path: 'admin/blogposts/edit/:id',
    loadComponent: () => import('./features/blogpost/edit-blogpost/edit-blogpost').then(m => m.EditBlogpost)
  }
];
