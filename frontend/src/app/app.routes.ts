import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
  {
    path: 'products/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'seller',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'SELLER' },
    children: [
      { path: 'dashboard', loadComponent: () => import('./pages/seller-dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent) },
      { path: 'media', loadComponent: () => import('./pages/media-manager/media-manager.component').then(m => m.MediaManagerComponent) }
    ]
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  }
];
