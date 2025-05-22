// ui/src/app/pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService, Product } from '../../services/products.services'; // Chemin corrigé
import { ProductCardComponent } from '../../components/product-card/product-card.component'; // Chemin corrigé

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.findAll().subscribe(
      (products: Product[]) => {
        this.featuredProducts = products.slice(0, 4);
      },
      (error: any) => {
        console.error('Erreur lors du chargement des produits phares:', error);
      }
    );
  }
}
