import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="card-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Buy-01 account</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="you@example.com" required>
            <div class="error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              ✗ Valid email required
            </div>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="Enter your password" required>
            <div class="error" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
              ✗ Password required
            </div>
          </div>
          <button type="submit" class="btn-primary" [disabled]="form.invalid || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <div class="card-footer">
          <p>Don't have an account? <a routerLink="/register">Create one</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 2rem;
    }
    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(255, 107, 53, 0.15);
      width: 100%;
      max-width: 420px;
      overflow: hidden;
    }
    .card-header {
      background: white;
      color: #333;
      padding: 2.5rem 2rem;
      text-align: center;
    }
    .card-header h1 {
      margin: 0 0 0.5rem;
      font-size: 1.8rem;
      font-weight: 700;
      color: #333;
    }
    .card-header p {
      margin: 0;
      font-size: 0.95rem;
      color: #666;
    }
    form {
      padding: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.6rem;
      font-weight: 600;
      color: #333;
      font-size: 0.95rem;
    }
    input {
      width: 100%;
      padding: 0.85rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: #FF6B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    input::placeholder {
      color: #999;
    }
    .error {
      color: #d32f2f;
      font-size: 0.85rem;
      margin-top: 0.4rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .btn-primary {
      width: 100%;
      padding: 0.95rem;
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 0.5rem;
    }
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
    }
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .card-footer {
      padding: 0 2rem 2rem;
      text-align: center;
      border-top: 1px solid #f0f0f0;
    }
    .card-footer p {
      margin: 1rem 0 0;
      color: #666;
      font-size: 0.95rem;
    }
    .card-footer a {
      color: #FF6B35;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }
    .card-footer a:hover {
      color: #F7931E;
    }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.loading = false;
      }
    });
  }
}
