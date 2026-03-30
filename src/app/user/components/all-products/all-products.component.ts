import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router} from '@angular/router';
import { Category } from '../../../core/models/category';
import { Product } from '../../../core/models/product';
import { CommonModule, DecimalPipe } from '@angular/common'
import { FormsModule} from '@angular/forms';
import { UserCartService } from '../../services/userCart.service';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { Options } from '@angular-slider/ngx-slider';
import { AuthService } from '../../../auth/service/auth.service';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [DecimalPipe,FormsModule,CommonModule,NgxSliderModule],
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  Products = signal<Product[]>([]);
  cart:{item:Product,quantity:number}[]=[]
  Allcategories: Category[] = [];
  // category:string='all';
  selectedCategoryId=signal<number | null>(null);
  isfiltered= signal<boolean>(false)
  offset = signal<number>(0);
  isMoreData = signal<boolean>(true);

  private _products= inject(ProductsService);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _cartService = inject(UserCartService);
  private _auth = inject(AuthService);

  minValue=signal(0);
  maxValue=signal(2000);
  options: Options = {
    floor: 0,
    ceil: 2000,
    step: 10,
    hideLimitLabels: true, 
    hidePointerLabels: false 
  };



  ngOnInit() {
    this._activatedRoute.paramMap.subscribe(params => {
      const categoryId = params.get('id');
      this.offset.set(0);
      if (categoryId) {
        this.getProductbycat(+categoryId);
        this.selectedCategoryId.set(+categoryId);
      } else {
        this.clearFilters();
      }
    });
    this.getcats()
  }


  clearFilters(){
    this.isfiltered.set(false)
    this.selectedCategoryId.set(null);
    this.minValue.set(0);
    this.maxValue.set(2000);
    this.resetPagination();
    this.fetchData();
  }

  getProductbycat(id:number){
    this.isfiltered.set(true)
    this.selectedCategoryId.set(id);
    this.resetPagination();
    this.fetchData(); 
  }

  getcats(){
    this._products.getAllCategories(5).subscribe({
    next: (res) =>{
      this.Allcategories=res
      // console.log(this.categories)
    },
    error: (err) =>{
      console.log(err)
      this._router.navigate(['**'])

    }
  })
  }

  filterByPrice() {
    this.resetPagination();
    this.fetchData();
  }

  resetPagination() {
    this.offset.set(0);
    this.Products.set([]); 
    this.isMoreData.set(true);
  }

  fetchData() {
    const currentOffset = this.offset();
    const min = this.minValue();
    const max = this.maxValue();
    const catId = this.selectedCategoryId();

    
    this._products.filterProductsByCategoryAndPrice(catId, min, max,currentOffset).subscribe({
      next: (res) => {
        this.Products.update(prd => [...prd, ...res])
        if (res.length === 0 || res.length < this._products.limit()) {
          this.isMoreData.set(false);
        }
      },
      error: (err) => this._router.navigate(['**'])
    });
    

  }

  loadMore(){
    this.offset.update(value => value + this._products.limit());
    this.fetchData();    
  }

  addToCart(prd:Product, event: any){
    event.stopPropagation();
    if(!this._auth.isLoggedIn()){
      this._router.navigate(['/auth/login'])
      return
    }
    this._cartService.addToCart(prd)
  }

  showDetails(id: number) {
    this._router.navigate(['/user/details', id]);
  }





}
