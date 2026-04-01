import { Injectable } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import {AddCategoryRequest, Category } from "../models/category.model";  
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private apiUrl = environment.apiUrl; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  addCategory(categoryData: AddCategoryRequest) {
    return this.http.post<void>(`${this.apiUrl}/api/categories`, categoryData);
  }

  getAllCategories() {
    // return this.http.get(`${this.apiUrl}/api/categories`);
    const response= httpResource<Category[]>(() => `${this.apiUrl}/api/categories`);
    console.log(response);
    return response;
  }

  
}
