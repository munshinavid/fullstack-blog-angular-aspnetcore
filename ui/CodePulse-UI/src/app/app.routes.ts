import { Routes } from '@angular/router';
import { Home } from './features/public/home/home';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    component: Home,
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'blog/:url',
    loadComponent: () => import('./features/public/blog-details/blog-details').then(m => m.BlogDetails)
  },

  // Admin routes — protected by adminGuard
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/categories',
    loadComponent: () => import('./features/category/category-list/category-list').then(m => m.CategoryList),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/categories/add',
    loadComponent: () => import('./features/category/add-category/add-category').then(m => m.AddCategory),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/categories/edit/:id',
    loadComponent: () => import('./features/category/edit-category/edit-category').then(m => m.EditCategory),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/blogposts',
    loadComponent: () => import('./features/blogpost/blogpost-list/blogpost-list').then(m => m.BlogpostList),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/blogposts/add',
    loadComponent: () => import('./features/blogpost/add-blogpost/add-blogpost').then(m => m.AddBlogPost),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/blogposts/edit/:id',
    loadComponent: () => import('./features/blogpost/edit-blogpost/edit-blogpost').then(m => m.EditBlogpost),
    canActivate: [adminGuard]
  }
];
