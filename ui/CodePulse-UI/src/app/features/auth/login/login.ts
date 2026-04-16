import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = new FormGroup({
    email: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.email] 
    }),
    password: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required] 
    })
  });

  onLoginSubmit() {
    if (this.loginForm.invalid) return;

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const loginRequest = this.loginForm.getRawValue();

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.isSubmitting.set(false);
        
        // ১. AuthService এর মাধ্যমে টোকেন এবং ইউজার ডাটা সেভ করা
        this.authService.setUser(response);

        // ২. হোম পেজে পাঠিয়ে দেওয়া
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Invalid email or password. Please try again.');
        console.error(err);
      }
    });
  }
}