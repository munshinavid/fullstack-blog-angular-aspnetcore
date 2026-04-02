import { inject, Injectable } from '@angular/core';
import { BlogPost, CreateBlogPostRequest } from '../models/blogpost.model';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService {
  private apiUrl = environment.apiUrl; // Replace with your actual API URL
  private http=inject(HttpClient);

  createBlogPost(blogPostData: CreateBlogPostRequest) {
    // এখানে তোমার API কল করার লজিক থাকবে, যেমন HttpClient ব্যবহার করে POST রিকোয়েস্ট পাঠানো
    // উদাহরণ:
    return this.http.post<void>(`${this.apiUrl}/api/blogposts`, blogPostData);
  }

  getAllBlogPosts(): HttpResourceRef<BlogPost[] | undefined> {
    return httpResource<BlogPost[]>(() => `${this.apiUrl}/api/blogposts`);
  }
  
}
