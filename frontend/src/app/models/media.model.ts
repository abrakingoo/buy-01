export interface MediaResponse {
  id: string;
  url: string;
  uploadedAt: string;
}

export interface MediaFile {
  id: string;
  sellerId: string;
  filename: string;
  mimeType: string;
  size: number;
  storageUrl: string;
  uploadedAt: string;
}
