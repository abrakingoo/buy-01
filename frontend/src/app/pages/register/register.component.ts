import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="card-header">
          <h1>Join Buy-01</h1>
          <p>Create your account to get started</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" formControlName="name" placeholder="John Doe" required>
            <div class="error" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
              ✗ Name required
            </div>
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" formControlName="email" placeholder="you@example.com" required>
            <div class="error" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              ✗ Valid email required
            </div>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="At least 6 characters" required>
            <div class="error" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
              ✗ Password must be at least 6 characters
            </div>
          </div>
          <div class="form-group">
            <label>Account Type</label>
            <select formControlName="role" required>
              <option value="">Select your role</option>
              <option value="CLIENT">Client (Browse & Buy)</option>
              <option value="SELLER">Seller (Manage Products)</option>
            </select>
            <div class="error" *ngIf="form.get('role')?.invalid && form.get('role')?.touched">
              ✗ Please select an account type
            </div>
          </div>
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          <button type="submit" class="btn-primary" [disabled]="form.invalid || loading">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        <div class="card-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 2rem;
    }
    .register-card {
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
    input, select {
      width: 100%;
      padding: 0.85rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.3s;
      box-sizing: border-box;
      font-family: inherit;
    }
    input:focus, select:focus {
      outline: none;
      border-color: #FF6B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    input::placeholder {
      color: #999;
    }
    select {
      cursor: pointer;
      color: #333;
    }
    select option {
      color: #333;
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
    .error-message {
      background-color: #ffebee;
      color: #d32f2f;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      border-left: 4px solid #d32f2f;
    }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.errorMessage = err.status === 409 ? 'Email already exists' : 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
