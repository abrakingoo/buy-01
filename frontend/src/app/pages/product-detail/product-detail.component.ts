import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { KshCurrencyPipe } from '../../pipes/currency.pipe';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, KshCurrencyPipe],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productService.getProductById(params['id']).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: () => {
          this.toastService.show('Failed to load product', 'error');
        }
      });
    });
  }

  goBack(): void {
    this.location.back();
  }
}
