import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// ইউজারের ডাটা স্ট্রাকচার
export interface User {
  email: string;
  token: string;
  roles: string[];
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

  constructor() {
    // ২. অ্যাপ রিলোড হলে লোকাল স্টোরেজ থেকে ডাটা রিকভার করা
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  // ৩. রেজিস্ট্রেশন মেথড
  register(model: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/auth/register`, model);
  }

  // ৪. লগইন মেথড
  login(model: loginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/api/auth/login`, model,);
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