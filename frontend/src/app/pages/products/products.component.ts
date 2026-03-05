import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (response: any) => {
        console.log('Products response:', response);
        this.products = Array.isArray(response) ? response : response.content || [];
        console.log('Processed products:', this.products);
        this.products.forEach(p => {
          console.log(`Product ${p.name}:`, p.imageUrls);
        });
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }
}
