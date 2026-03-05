export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrls: string[];
}

export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}
