import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaService } from '../../services/media.service';
import { MediaResponse } from '../../models/media.model';

@Component({
  selector: 'app-media-manager',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h1>Media Manager</h1>
      <div style="margin-bottom: 2rem;">
        <h2>Upload Image</h2>
        <input type="file" #fileInput accept="image/*" (change)="onFileSelected($event)">
        <p style="font-size: 0.875rem; color: #666; margin-top: 0.5rem;">
          Max 2MB, formats: JPEG, PNG, GIF, WebP
        </p>
        <div *ngIf="validationError" style="color: #d32f2f; margin-top: 0.5rem; font-size: 0.875rem;">
          {{ validationError }}
        </div>
        <div *ngIf="uploadError" style="color: #d32f2f; margin-top: 0.5rem; font-size: 0.875rem;">
          {{ uploadError }}
        </div>
        <div *ngIf="selectedFile" style="color: #1976d2; margin-top: 0.5rem; font-size: 0.875rem;">
          Selected: {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }}MB)
        </div>
        <button (click)="uploadImage()" [disabled]="!selectedFile || uploading || !!validationError" style="margin-top: 1rem;">
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>
      <div *ngIf="uploadedImages.length > 0">
        <h2>Uploaded Images</h2>
        <div class="grid">
          <div *ngFor="let image of uploadedImages" style="position: relative;">
            <img [src]="image.url" alt="Uploaded" style="width: 100%; border-radius: 8px;">
            <button (click)="deleteImage(image.id)" style="position: absolute; top: 0.5rem; right: 0.5rem; background: #d32f2f;">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MediaManagerComponent {
  selectedFile: File | null = null;
  uploadedImages: MediaResponse[] = [];
  uploading = false;
  validationError = '';
  uploadError = '';
  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  constructor(private mediaService: MediaService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.validationError = '';
    this.uploadError = '';
    
    if (input.files?.length) {
      const file = input.files[0];
      
      if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
        this.validationError = `Invalid file type. Allowed: JPEG, PNG, GIF, WebP`;
        this.selectedFile = null;
        return;
      }
      
      if (file.size > this.MAX_FILE_SIZE) {
        this.validationError = `File size exceeds 2MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`;
        this.selectedFile = null;
        return;
      }
      
      this.selectedFile = file;
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadError = '';
    this.mediaService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadedImages.push(response);
        this.selectedFile = null;
        this.validationError = '';
        this.uploading = false;
      },
      error: (err) => {
        this.uploadError = err.error?.message || 'Upload failed. Please try again.';
        this.uploading = false;
      }
    });
  }

  deleteImage(id: string): void {
    if (confirm('Delete this image?')) {
      this.mediaService.deleteImage(id).subscribe({
        next: () => {
          this.uploadedImages = this.uploadedImages.filter(img => img.id !== id);
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}
