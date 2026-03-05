import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { KshCurrencyPipe } from '../../pipes/currency.pipe';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, KshCurrencyPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        this.products = Array.isArray(response) ? response : response.content || [];
      },
      error: () => {
        this.toastService.show('Failed to load products', 'error');
      }
    });
  }
}
