import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth-service';

// Guard checks if user is logged in AND has the 'Admin' role.
// Usage: add `canActivate: [adminGuard]` to any admin route.
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.user();

  // Allow access if user exists and has Admin role
  if (user && user.roles.includes('Admin')) {
    return true;
  }

  // Redirect to login if not authorized
  router.navigate(['/login']);
  return false;
};
