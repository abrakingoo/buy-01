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
        <button (click)="uploadImage()" [disabled]="!selectedFile || uploading" style="margin-top: 1rem;">
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

  constructor(private mediaService: MediaService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.mediaService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.uploadedImages.push(response);
        this.selectedFile = null;
        this.uploading = false;
      },
      error: (err) => {
        console.error('Upload failed', err);
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
