import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MediaResponse, MediaFile } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private apiUrl = 'http://localhost:8080/api/media/images';
  private readonly MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  constructor(private http: HttpClient) {}

  uploadImage(file: File, productId?: string, sellerId?: string): Observable<MediaResponse> {
    if (!this.isValidFile(file)) {
      throw new Error('Invalid file: must be an image (JPEG, PNG, GIF, WebP) under 2MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    if (productId) formData.append('productId', productId);
    if (sellerId) formData.append('sellerId', sellerId);
    return this.http.post<MediaResponse>(this.apiUrl, formData);
  }

  getImage(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}`, { responseType: 'blob' });
  }

  deleteImage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private isValidFile(file: File): boolean {
    return this.ALLOWED_TYPES.includes(file.type) && file.size <= this.MAX_FILE_SIZE;
  }
}
