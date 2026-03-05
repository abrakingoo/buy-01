import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  user: User | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.form.patchValue({
        name: this.user.name
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.userService.updateProfile(this.form.value).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.authService.setCurrentUser(updatedUser);
        this.toastService.show('Profile updated successfully!', 'success');
        this.loading = false;
      },
      error: () => {
        this.toastService.show('Failed to update profile', 'error');
        this.loading = false;
      }
    });
  }
}
