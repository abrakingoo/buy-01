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
      <div class="upload-section">
        <h2>Upload Image</h2>
        <input type="file" #fileInput accept="image/*" (change)="onFileSelected($event)">
        <p class="help-text">
          Max 2MB, formats: JPEG, PNG, GIF, WebP
        </p>
        <div *ngIf="validationError" class="error-text">
          {{ validationError }}
        </div>
        <div *ngIf="uploadError" class="error-text">
          {{ uploadError }}
        </div>
        <div *ngIf="selectedFile" class="success-text">
          Selected: {{ selectedFile.name }} ({{ (selectedFile.size / 1024 / 1024).toFixed(2) }}MB)
        </div>
        <button (click)="uploadImage()" [disabled]="!selectedFile || uploading || !!validationError" class="upload-btn">
          {{ uploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>
      <div *ngIf="uploadedImages.length > 0" class="images-section">
        <h2>Uploaded Images</h2>
        <div class="grid">
          <div *ngFor="let image of uploadedImages" class="image-item">
            <img [src]="image.url" alt="Uploaded" class="image">
            <button (click)="deleteImage(image.id)" class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      padding: clamp(1.5rem, 3vw, 2rem);
    }
    h1 {
      font-size: clamp(1.5rem, 5vw, 2rem);
      margin-bottom: clamp(1.5rem, 3vw, 2rem);
      color: #333;
    }
    h2 {
      font-size: clamp(1.1rem, 3vw, 1.3rem);
      margin-bottom: 1rem;
      color: #333;
    }
    .upload-section {
      margin-bottom: clamp(1.5rem, 3vw, 2rem);
    }
    input[type="file"] {
      display: block;
      margin-bottom: 1rem;
      padding: 0.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      width: 100%;
      box-sizing: border-box;
    }
    .help-text {
      font-size: clamp(0.8rem, 2vw, 0.875rem);
      color: #666;
      margin: 0.5rem 0;
    }
    .error-text {
      color: #d32f2f;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      margin-top: 0.5rem;
    }
    .success-text {
      color: #1976d2;
      font-size: clamp(0.75rem, 2vw, 0.875rem);
      margin-top: 0.5rem;
    }
    .upload-btn {
      margin-top: 1rem;
      padding: clamp(0.7rem, 1.5vw, 0.85rem) clamp(1rem, 2vw, 1.5rem);
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: clamp(0.85rem, 2vw, 0.95rem);
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
    }
    .upload-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.3);
    }
    .upload-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .images-section {
      margin-top: clamp(1.5rem, 3vw, 2rem);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(clamp(120px, 30vw, 200px), 1fr));
      gap: clamp(0.75rem, 2vw, 1.5rem);
    }
    .image-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
    }
    .image {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 8px;
      display: block;
    }
    .delete-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #d32f2f;
      color: white;
      border: none;
      padding: clamp(0.4rem, 1vw, 0.6rem) clamp(0.6rem, 1.5vw, 0.8rem);
      border-radius: 4px;
      font-size: clamp(0.7rem, 2vw, 0.8rem);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .delete-btn:hover {
      background: #b71c1c;
      transform: scale(1.05);
    }
    @media (max-width: 480px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
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
        error: () => {
          // Error already handled by error interceptor
        }
      });
    }
  }
}
