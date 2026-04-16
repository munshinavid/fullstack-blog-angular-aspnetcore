import { inject, Injectable } from '@angular/core';
import { BlogPost, CreateBlogPostRequest, PagedResult } from '../models/blogpost.model';
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

  getAllBlogPosts(query: () => string, page: () => number, pageSize: () => number): HttpResourceRef<PagedResult<BlogPost> | undefined> {
    return httpResource<PagedResult<BlogPost>>(() => {
        let url = `${this.apiUrl}/api/blogposts?page=${page()}&pageSize=${pageSize()}`;
        if (query()) {
          url += `&query=${encodeURIComponent(query())}`;
        }
        return url;
    });
  }

  getBlogPostById(id: () => string | undefined): HttpResourceRef<BlogPost | undefined> {
    return httpResource<BlogPost>(() => `${this.apiUrl}/api/blogposts/${id()}`);
  }

  getBlogPostByUrlHandle(urlHandle: () => string | undefined): HttpResourceRef<BlogPost | undefined> {
    return httpResource<BlogPost>(() => `${this.apiUrl}/api/blogposts/urlHandle/${urlHandle()}`);
  }

  updateBlogPost(id: string, blogPostData: CreateBlogPostRequest) {
    return this.http.put<void>(`${this.apiUrl}/api/blogposts/${id}`, blogPostData);
  }

  deleteBlogPost(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/api/blogposts/${id}`);
  }
  
}
