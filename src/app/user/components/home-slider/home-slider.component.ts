import { Component, OnInit, inject } from '@angular/core';
import { Iproduct } from '../../../core/models/iproduct';
import { ProductsService } from '../../services/products.service';
import { Router, RouterLink } from '@angular/router';
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string;
}
@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css'
})
export class HomeSliderComponent implements OnInit {
  private productsService = inject(ProductsService);
  private _router = inject(Router);
  Allcategories: Category[] = [];
  products: Iproduct[] = [];

  ngOnInit(): void {
    this.getproducts();
    this.Allcategories = this.productsService.categories;
    // this.getcats();
  }

  getproducts(){
    this.productsService.getLimitedProducts(5).subscribe({
      next: (res) => {
        this.products = res;  
      },
      error: (err) => {
        console.log(err);
      } 
    });
  }
  showDetails(id: number) {
    this._router.navigate(['/user/details', id]);
  }

  // getcats(){
  //   this.productsService.getAllCategories().subscribe({
  //   next: (res) =>{
  //     this.Allcategories=res
  //   },
  //   error: (err) =>{
  //     console.log(err)
  //     this._router.navigate(['**'])

  //   }
  // })
  // }


}
