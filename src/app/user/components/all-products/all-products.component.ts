import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Iproduct } from '../../../core/interfaces/iproduct';
import { Router, RouterLink } from '@angular/router';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [SelectComponent,ProductCardComponent],
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {

  Products:Iproduct[]=[] as Iproduct[]
  cart:{item:Iproduct,quantity:number}[]=[]
  Allcategories=[]
  category:string='all';



  constructor(private _products:ProductsService,private _router:Router) { }

  ngOnInit() {
    this.getProducts()
    this.getcats()
  }

  getProducts(){
    this._products.getAllProducts().subscribe({
    next: (res) =>{
      this.Products=res
      // console.log(this.Products)
    },
    error: (err) =>{
      console.log(err)
      this._router.navigate(['**'])

    }
  })
  }


  filterProducts(event:any){
    this.category=event.target.value
    // console.log(this.category)
    if(this.category=='all'){
      this.getProducts()
      // console.log(this.Products)
    }else{
      this.getProductbycat(this.category)
      // console.log(this.Products)
    }
  }

  getProductbycat(cat:string){
  this._products.getProductsByCategory(cat).subscribe({
    next: (res) =>{
      this.Products=res
    // console.log('filtered',this.Products)
    },
    error: (err) =>{
      console.log(err)
      this._router.navigate(['**'])
    }
  })
  }


  getcats(){
    this._products.getAllCategories().subscribe({
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

  addToCart(event:any){
    // console.log(JSON.stringify(event))
    if(localStorage.getItem('cart')){
      this.cart=JSON.parse(localStorage.getItem('cart')!)
      let exsit=this.cart.find(prod => prod.item.id === event.item.id)
      if(!exsit){
        this.cart.push(event)
        localStorage.setItem('cart',JSON.stringify(this.cart))
      }
    }else{
      this.cart.push(event)
      localStorage.setItem('cart',JSON.stringify(this.cart))
    }
  }



}
