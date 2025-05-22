// ui/src/app/components/product-card/product-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../services/products.services'; // Chemin mis à jour

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;

  constructor() { }

  ngOnInit(): void {
    if (!this.product.image) {
      this.product.image = 'assets/images/placeholder-product.jpg';
    }
  }
}
