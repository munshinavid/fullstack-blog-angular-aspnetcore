import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AddCategoryRequest } from "../models/category.model";  

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private apiUrl = 'https://localhost:7071'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  addCategory(categoryData: AddCategoryRequest) {
    return this.http.post<void>(`${this.apiUrl}/api/categories`, categoryData);
  }

  
}
