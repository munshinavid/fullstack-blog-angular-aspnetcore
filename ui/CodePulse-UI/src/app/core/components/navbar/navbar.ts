import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
})
export class Navbar {
  authService = inject(AuthService);
  
  // AuthService এর ইউজার সিগন্যালটি এখানে নিয়ে আসা
  user = this.authService.user; 

  onLogout() {
    this.authService.logout();
  }
}