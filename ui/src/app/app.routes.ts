// ui/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  // Ajoutez d'autres routes ici au fur et à mesure
  // { path: 'products/:id', component: ProductDetailComponent },
  // { path: 'about-us', component: AboutUsComponent },
  // { path: 'contact', component: ContactComponent },
  // { path: 'cart', component: CartComponent },
  // { path: 'auth/login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];
