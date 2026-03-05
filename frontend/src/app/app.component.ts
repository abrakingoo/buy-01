import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastDisplayComponent } from './components/toast-display.component';
import { User } from './models/auth.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastDisplayComponent],
  template: `
    <nav class="navbar">
      <div class="container">
        <a routerLink="/" class="logo">Buy-01</a>
        <div class="nav-links">
          <a routerLink="/products">Products</a>
          <ng-container *ngIf="currentUser">
            <span *ngIf="currentUser.role === 'SELLER'">
              <a routerLink="/seller/dashboard">Dashboard</a>
            </span>
            <a routerLink="/profile">{{ currentUser.name }}</a>
            <button (click)="logout()">Logout</button>
          </ng-container>
          <ng-container *ngIf="!currentUser">
            <a routerLink="/login">Login</a>
            <a routerLink="/register">Register</a>
          </ng-container>
        </div>
      </div>
    </nav>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
    <app-toast-display></app-toast-display>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Buy-01</h3>
          <p>Your trusted e-commerce marketplace for quality products and seamless shopping experience.</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/products">Products</a></li>
            <li><a routerLink="/">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Support</h3>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support&#64;buy-01.com</p>
          <p>Phone: +254 7334 7334</p>
          <p>Address: Oginga Odinga Street, Kisumu, Kenya</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Buy-01. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: white;
      padding: 1.2rem 0;
      margin-bottom: 2rem;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
      font-size: 0.95rem;
    }
    .nav-links a:hover {
      color: #FFE5CC;
    }
    .nav-links button {
      background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
      color: #333;
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      border: none;
      cursor: pointer;
    }
    .nav-links button:hover {
      background: linear-gradient(135deg, #FFC700 0%, #FF9500 100%);
    }
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
    }
    main {
      min-height: calc(100vh - 300px);
    }
    .footer {
      background: linear-gradient(135deg, #333 0%, #1a1a1a 100%);
      color: white;
      margin-top: 4rem;
      padding: 3rem 0 1rem;
    }
    .footer-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .footer-section h3 {
      color: #FF6B35;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    .footer-section p {
      color: #ccc;
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 0.5rem;
    }
    .footer-section ul {
      list-style: none;
    }
    .footer-section ul li {
      margin-bottom: 0.5rem;
    }
    .footer-section a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-section a:hover {
      color: #FF6B35;
    }
    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #444;
      color: #999;
      font-size: 0.9rem;
      max-width: 1400px;
      margin: 0 auto;
      padding-left: 2rem;
      padding-right: 2rem;
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentUser = this.authService.getCurrentUser();
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/products']);
      }
    });
  }
}
