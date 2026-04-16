import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  // রেজিস্ট্রেশন ফর্ম সেটআপ
  registerForm = new FormGroup({
    email: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.email] 
    }),
    password: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(6)] 
    }),
    confirmPassword: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required] 
    })
  });

  onRegisterSubmit() {
    if (this.registerForm.invalid) return;

    const { email, password, confirmPassword } = this.registerForm.getRawValue();

    // পাসওয়ার্ড ম্যাচিং চেক
    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match!');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        // ব্যাকএন্ড থেকে আসা এরর মেসেজ হ্যান্ডেল করা
        this.errorMessage.set(err.error?.[0]?.description || 'Registration failed. Try again.');
      }
    });
  }
}