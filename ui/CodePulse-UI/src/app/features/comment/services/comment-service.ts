import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { AddCommentRequest, Comment, UpdateCommentRequest } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCommentsByBlogPostId(blogPostId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/api/comments/post/${blogPostId}`);
  }

  addComment(request: AddCommentRequest): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/api/comments`, request,
         {withCredentials: true});
  }

  // Update endpoint kept for future backend implementation.
  updateComment(commentId: string, request: UpdateCommentRequest): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/api/comments/${commentId}`, request);
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/comments/${commentId}`,
      { withCredentials: true });
  }
}
