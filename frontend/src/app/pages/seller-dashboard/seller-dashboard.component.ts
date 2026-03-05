import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { MediaService } from '../../services/media.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { KshCurrencyPipe } from '../../pipes/currency.pipe';
import { Product } from '../../models/product.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, KshCurrencyPipe],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css']
})
export class SellerDashboardComponent implements OnInit {
  form: FormGroup;
  products: Product[] = [];
  loading = false;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  sellerId: string = '';
  editingId: string | null = null;
  originalProduct: Product | null = null;
  showDeleteModal = false;
  deleteProductId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private mediaService: MediaService,
    private authService: AuthService,
    public toastService: ToastService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.sellerId = user.id;
    }
    this.loadProducts();
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
      const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles: File[] = [];
      
      Array.from(input.files).forEach(file => {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          this.toastService.show(`${file.name}: Invalid file type. Use JPEG, PNG, GIF, or WebP.`, 'error');
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          this.toastService.show(`${file.name}: File exceeds 2MB limit.`, 'error');
          return;
        }
        validFiles.push(file);
      });
      
      this.selectedFiles = validFiles;
      this.imagePreviews = [];
      
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  editProduct(product: Product): void {
    this.editingId = product.id;
    this.originalProduct = { ...product };
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    });
    window.scrollTo(0, 0);
  }

  cancelEdit(): void {
    this.editingId = null;
    this.originalProduct = null;
    this.selectedFiles = [];
    this.imagePreviews = [];
    this.form.reset();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    
    if (this.editingId) {
      const updateData: any = {};
      const formValue = this.form.value;
      
      if (formValue.name !== this.originalProduct?.name) updateData.name = formValue.name;
      if (formValue.description !== this.originalProduct?.description) updateData.description = formValue.description;
      if (formValue.price !== this.originalProduct?.price) updateData.price = formValue.price;
      if (formValue.stock !== this.originalProduct?.stock) updateData.stock = formValue.stock;

      if (this.selectedFiles.length > 0) {
        const uploadObservables = this.selectedFiles.map(file => 
          this.mediaService.uploadImage(file, this.editingId!, this.sellerId)
        );

        forkJoin(uploadObservables).subscribe({
          next: (responses) => {
            const imageUrls = responses.map(r => r.url);
            updateData.imageUrls = imageUrls;
            
            this.productService.updateProduct(this.editingId!, updateData).subscribe({
              next: () => {
                this.toastService.show('Product updated successfully!', 'success');
                this.editingId = null;
                this.originalProduct = null;
                this.resetForm();
                this.loadProducts();
                this.loading = false;
              },
              error: () => {
                this.toastService.show('Failed to update product', 'error');
                this.loading = false;
              }
            });
          },
          error: () => {
            this.toastService.show('Image upload failed', 'error');
            this.loading = false;
          }
        });
      } else {
        this.productService.updateProduct(this.editingId, updateData).subscribe({
          next: () => {
            this.toastService.show('Product updated successfully!', 'success');
            this.editingId = null;
            this.originalProduct = null;
            this.resetForm();
            this.loadProducts();
            this.loading = false;
          },
          error: () => {
            this.toastService.show('Failed to update product', 'error');
            this.loading = false;
          }
        });
      }
    } else {
      const productData = {
        ...this.form.value,
        sellerId: this.sellerId,
        imageUrls: []
      };

      this.productService.createProduct(productData).subscribe({
        next: (createdProduct: any) => {
          const productId = createdProduct.id;
          
          if (this.selectedFiles.length > 0) {
            const uploadObservables = this.selectedFiles.map(file => 
              this.mediaService.uploadImage(file, productId, this.sellerId)
            );

            forkJoin(uploadObservables).subscribe({
              next: (responses) => {
                const imageUrls = responses.map(r => r.url);
                
                const updateData = {
                  ...this.form.value,
                  sellerId: this.sellerId,
                  imageUrls
                };
                this.productService.updateProduct(productId, updateData).subscribe({
                  next: (updatedProduct) => {
                    this.toastService.show('Product created successfully!', 'success');
                    this.products.unshift(updatedProduct);
                    this.resetForm();
                    this.loading = false;
                  },
                  error: () => {
                    this.toastService.show('Failed to create product', 'error');
                    this.loading = false;
                  }
                });
              },
              error: () => {
                this.toastService.show('Image upload failed', 'error');
                this.loading = false;
              }
            });
          } else {
            this.toastService.show('Product created successfully!', 'success');
            this.products.unshift(createdProduct);
            this.resetForm();
            this.loading = false;
          }
        },
        error: () => {
          this.toastService.show('Failed to create product', 'error');
          this.loading = false;
        }
      });
    }
  }

  deleteProduct(id: string): void {
    const product = this.products.find(p => p.id === id);
    if (product && product.sellerId === this.sellerId) {
      this.deleteProductId = id;
      this.showDeleteModal = true;
    }
  }

  confirmDelete(): void {
    if (this.deleteProductId) {
      this.productService.deleteProduct(this.deleteProductId).subscribe({
        next: () => {
          this.toastService.show('Product deleted successfully!', 'success');
          this.products = this.products.filter(p => p.id !== this.deleteProductId);
          this.showDeleteModal = false;
          this.deleteProductId = null;
        },
        error: () => {
          this.toastService.show('Failed to delete product', 'error');
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteProductId = null;
  }

  resetForm(): void {
    this.form.reset();
    this.selectedFiles = [];
    this.imagePreviews = [];
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        const allProducts = Array.isArray(response) ? response : response.content || [];
        this.products = allProducts.filter((p: Product) => p.sellerId === this.sellerId);
      },
      error: () => {
        this.toastService.show('Failed to load products', 'error');
      }
    });
  }
}
