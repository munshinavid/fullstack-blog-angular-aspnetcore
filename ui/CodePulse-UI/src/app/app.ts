import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "./core/components/navbar/navbar";
import { AuthService } from './features/auth/services/auth-service';
// Improvement #4: Import footer component for every-page rendering
import { Footer } from './core/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authService = inject(AuthService);
  protected readonly title = signal('CodePulse');

  constructor() {
    this.authService.initUser();
  }
}
