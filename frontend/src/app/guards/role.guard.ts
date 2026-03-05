import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['role'];

    if (!requiredRole) {
      return true;
    }

    const user = this.authService.getCurrentUser();
    if (user && user.role === requiredRole) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
