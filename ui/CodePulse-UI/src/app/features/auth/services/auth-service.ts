import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// ইউজারের ডাটা স্ট্রাকচার
export interface User {
  userId?: string;
  email: string;
  roles: string[];
}

export interface MeResponse {
  userId: string;
  email: string;
  role: string | null;
}

export interface loginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl; // তোমার ডটনেট এপিআই ইউআরএল

  // ১. ইউজার স্টেট ম্যানেজ করার জন্য সিগন্যাল
  user = signal<User | null>(null);

  constructor() {}

  initUser(): void {
    // ১. স্ক্রিন ফ্লিকার কমাতে আগে localStorage থেকে state set
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.user.set(JSON.parse(savedUser) as User);
      } catch {
        localStorage.removeItem('user');
      }
    }

    // ২. backend `/me` থেকে latest auth state এনে sync
    this.getMe().subscribe({
      next: (meUser) => {
        const current = this.user();
        const normalizedUser: User = {
          userId: meUser.userId,
          email: meUser.email,
          roles: meUser.role ? [meUser.role] : (current?.roles ?? []),
        };

        this.user.set(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      },
      error: () => {
        // cookie/session invalid হলে local auth state clear
        this.user.set(null);
        localStorage.removeItem('user');
      },
    });
  }

  // ৩. রেজিস্ট্রেশন মেথড
  register(model: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/auth/register`, model);
  }

  // ৪. লগইন মেথড
  login(model: loginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/api/auth/login`, model,);
  }

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/api/auth/me`);
  }

  // ৫. লগইন সফল হলে ডাটা সেভ করা
  setUser(user: User): void {
    this.user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
    console.log('User set in AuthService:', user);
  }

  // ৬. লগআউট মেথড
  logout(): void {
    this.http.post(`${this.apiUrl}/api/auth/logout`, {}).subscribe({
      next: () => {
        console.log('Logged out successfully');
      },
      error: (error) => {
        console.error('Error occurred while logging out:', error);
      }
    });

    localStorage.removeItem('user');
    this.user.set(null);
  }
}