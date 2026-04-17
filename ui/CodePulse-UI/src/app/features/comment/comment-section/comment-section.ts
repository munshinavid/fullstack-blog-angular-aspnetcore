import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../auth/services/auth-service';
import { AddCommentRequest, Comment } from '../models/comment.model';
import { CommentService } from '../services/comment-service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './comment-section.html',
})
export class CommentSection {
  blogPostId = input<string | undefined>();

  private readonly commentService = inject(CommentService);
  private readonly authService = inject(AuthService);

  comments = signal<Comment[]>([]);
  isLoadingComments = signal(false);
  commentsError = signal<string | null>(null);

  newCommentContent = signal('');
  isSubmitting = signal(false);
  submitError = signal<string | null>(null);
  deletingCommentId = signal<string | null>(null);
  deleteError = signal<string | null>(null);

  canSubmit = computed(
    () => this.newCommentContent().trim().length > 0 && !this.isSubmitting()
  );

  currentUserId = computed(() => this.getCurrentUserId());
  currentUserEmail = computed(() => this.authService.user()?.email?.trim().toLowerCase() ?? null);

  isAdmin = computed(() => {
    const roles = this.authService.user()?.roles ?? [];
    return roles.some((role) => role.toLowerCase() === 'admin');
  });

  constructor() {
    effect(() => {
      const currentBlogPostId = this.blogPostId();

      if (!currentBlogPostId) {
        this.comments.set([]);
        this.commentsError.set(null);
        return;
      }

      this.fetchComments(currentBlogPostId);
    });
  }

  fetchComments(blogPostId?: string): void {
    const currentBlogPostId = blogPostId ?? this.blogPostId();

    if (!currentBlogPostId) {
      return;
    }

    this.isLoadingComments.set(true);
    this.commentsError.set(null);

    this.commentService
      .getCommentsByBlogPostId(currentBlogPostId)
      .pipe(finalize(() => this.isLoadingComments.set(false)))
      .subscribe({
        next: (response) => {
          this.comments.set(response ?? []);
          console.log('Comments loaded successfully', response);
        },
        error: () => {
          this.commentsError.set('Failed to load comments. Please try again.');
        },
      });
  }

  submitComment(): void {
    const currentBlogPostId = this.blogPostId();
    const trimmedContent = this.newCommentContent().trim();

    if (!currentBlogPostId || !trimmedContent || this.isSubmitting()) {
      return;
    }

    const request: AddCommentRequest = {
      content: trimmedContent,
      blogPostId: currentBlogPostId,
    };

    this.isSubmitting.set(true);
    this.submitError.set(null);

    this.commentService
      .addComment(request)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (createdComment) => {
          this.comments.update((current) => [createdComment, ...current]);
          this.newCommentContent.set('');
        },
        error: () => {
          this.submitError.set('Failed to submit comment. Please login and try again.');
        },
      });
  }

  deleteComment(comment: Comment): void {
    if (this.deletingCommentId() || this.isSubmitting()) {
      return;
    }

    if (!this.canDeleteComment(comment)) {
      this.deleteError.set('You can only delete your own comments unless you are an admin.');
      return;
    }

    const isConfirmed = confirm('Are you sure you want to delete this comment?');
    if (!isConfirmed) {
      return;
    }

    this.deletingCommentId.set(comment.id);
    this.deleteError.set(null);

    this.commentService
      .deleteComment(comment.id)
      .pipe(finalize(() => this.deletingCommentId.set(null)))
      .subscribe({
        next: () => {
          this.comments.update((current) => current.filter((x) => x.id !== comment.id));
        },
        error: () => {
          this.deleteError.set('Failed to delete comment. Please try again.');
        },
      });
  }

  canDeleteComment(comment: Comment): boolean {
    if (this.isAdmin()) {
      return true;
    }

    return this.isOwnComment(comment);
  }

  isOwnComment(comment: Comment): boolean {

    const userId = this.normalizeValue(this.currentUserId());
    const commentUserId = this.normalizeValue(comment.userId);
    if (userId && commentUserId && userId === commentUserId) {
      return true;
    }

    const currentEmail = this.normalizeValue(this.currentUserEmail());
    const commentEmail = this.normalizeValue(comment.userEmail);
    return !!currentEmail && !!commentEmail && currentEmail === commentEmail;
  }

  getCommentCardClasses(comment: Comment): Record<string, boolean> {
    return {
      'border border-primary-subtle border-start border-3 bg-body-tertiary': this.isOwnComment(comment),
    };
  }

  private getCurrentUserId(): string | null {
  // ১. সরাসরি সিগন্যাল থেকে userId নিন (যা আপনি /me এন্ডপয়েন্ট থেকে পেয়েছেন)
  const userId = this.authService.user()?.userId;
  
  if (userId) {
    return userId;
  }

  // যদি আইডি না থাকে, তবে ইউজার লগইন নেই
  return null;
}

  updateCommentPlaceholder(_comment: Comment): void {
    this.submitError.set('Update feature will be enabled after backend update API is ready.');
  }

  private normalizeValue(value: string | null | undefined): string | null {
    const normalized = value?.trim().toLowerCase();
    return normalized ? normalized : null;
  }
}
