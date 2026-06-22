import { Component, inject, OnInit,computed} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Product } from '../../../core/models/product';
import { CommonModule, DecimalPipe } from '@angular/common'
import { FormsModule} from '@angular/forms';
import { UserCartService } from '../../services/userCart.service';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AuthService } from '../../../auth/service/auth.service';
import { ImageFallbackDirective } from '../../../shared/directive/image-fallback.directive';
import Swal from 'sweetalert2';
import { FilterProductsListFacadeService } from '../../services/filter-products-list-facade.service';
import { ProductListPaginationService } from '../../services/product-list-pagination.service';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [DecimalPipe, FormsModule, CommonModule, NgxSliderModule, ImageFallbackDirective],
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _cartService = inject(UserCartService);
  private readonly _auth = inject(AuthService);
  readonly _filterProductsListFacade = inject(FilterProductsListFacadeService);
  readonly _productListPaginationService = inject(ProductListPaginationService);

  selectedCategoryId = computed(() => this._filterProductsListFacade.selectedCategoryId());



  private readonly Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#fff'
  });



  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(params => {
      const categoryId = params.get('id');
      this._productListPaginationService.offset.set(0);
      if (categoryId) {
        this._filterProductsListFacade.getProductbycat(+categoryId);
        this._filterProductsListFacade.selectedCategoryId.set(+categoryId);
      } else {
        this._filterProductsListFacade.clearFilters();
      }
    });
    // this.getcats()
  }


  addToCart(prd: Product, event: any) {
    event.stopPropagation();
    
    if (!this._auth.isLoggedIn()) {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to login first to add items to your cart!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#a855f7',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Go to Login',
        background: '#1e293b',
        color: '#fff'
      }).then((result) => {
        if (result.isConfirmed) {
          this._router.navigate(['/auth/login']);
        }
      });
      return;
    }

  
    this._cartService.addToCart(prd);
    this.Toast.fire({
      icon: 'success',
      title: 'Added to cart successfully',
      background: '#1e293b'
    });
  }

  showDetails(id: number) {
    this._router.navigate(['/user/details', id]);
  }

}