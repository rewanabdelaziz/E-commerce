import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router, RouterLink} from '@angular/router';
import { Product } from '../../../core/models/product';
import { DecimalPipe, NgClass, NgIf } from '@angular/common';
import { UserCartService } from '../../services/userCart.service';
import { ImageFallbackDirective } from '../../../shared/directive/image-fallback.directive';
import { AuthService } from '../../../auth/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [DecimalPipe, NgClass, RouterLink, ImageFallbackDirective],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  currentId!: number;
  product = signal<Product | undefined>(undefined);
  currentImage: string = '';
  quantity: number = 1;

  private _products = inject(ProductsService);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _cartService = inject(UserCartService);
  private _auth = inject(AuthService);

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#fff'
  });

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      this.currentId = Number(paramMap.get('id'))
      this.getProductbyid(this.currentId)
    })
  }

  getProductbyid(id: number) {
    this._products.getProductsById(id).subscribe({
      next: (res) => {
        this.product.set(res);
        if (this.product()?.images && this.product()!.images.length > 0) {
          this.currentImage = this.product()!.images![0];
        }
      },
      error: (err) => {
        console.log(err)
        this._router.navigate(['**'])
      }
    })
  }

  selectimg(img: string) {
    this.currentImage = img
  }

  plusquantity() {
    this.quantity++
  }

  minusquantity() {
    if (this.quantity > 1) {
      this.quantity--
    }
  }

  addToCart() {
    if (!this._auth.isLoggedIn()) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to add this product to your cart',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#a855f7',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Login Now',
        background: '#1e293b',
        color: '#fff'
      }).then((result) => {
        if (result.isConfirmed) {
          this._router.navigate(['/auth/login']);
        }
      });
      return;
    }

    this._cartService.addToCart(this.product()!, this.quantity);
    this.Toast.fire({
      icon: 'success',
      title: `${this.quantity} item(s) added to cart`
    });
  }
}