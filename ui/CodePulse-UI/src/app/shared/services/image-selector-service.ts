import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BlogImage {
  id: string;
  url: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 🔹 Get all images (gallery)
  getAll(): Observable<BlogImage[]> {
    return this.http.get<BlogImage[]>(`${this.apiUrl}/api/images`);
  }

  // 🔹 Upload image
  upload(file: File, fileName: string, title: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);

    return this.http.post<string>(`${this.apiUrl}/api/images/upload`, formData);
  }
  
}
