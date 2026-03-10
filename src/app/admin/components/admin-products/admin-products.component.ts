// import { Iproduct } from '../../../core/models/iproduct';
import { SelectComponent } from './../../../shared/components/select/select.component';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../user/services/products.service';
import { NgIf, SlicePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminProductsService } from '../../services/admin-products.service';
import { Category } from '../../../core/models/category';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [SlicePipe,ReactiveFormsModule,NgIf],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit{
  products:Product[] = [] as Product[];
  Allcategories: Category[] = [];
  msg="";
  base64:any=[];
  currentProduct:Product = {} as Product
  ProductForm!:FormGroup;

  constructor(private _productService : ProductsService,private _fb:FormBuilder, private _AdminProductsService: AdminProductsService){

  }
  ngOnInit(): void {
    this.ProductForm=this._fb.group({
      title:['',Validators.required],
      price:['',Validators.required],
      description:['',Validators.required],
      image:['',Validators.required],
      category:['',Validators.required],
    })
    this.getAllProducts()
    this.getAllcats()
  }

  getAllProducts(){
    this._productService.filterProductsByCategoryAndPrice(null, 0, 2000, 0).subscribe({
      next: (res)=>{
        this.products=res
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }

  getAllcats(){
    this._productService.getAllCategories().subscribe({
    next: (res) =>{
      this.Allcategories = (res as Category[]) || []
    },
    error: (err) =>{
      console.log(err)
    }
  })
  }

  getSelectedCategory(event:any){
    this.ProductForm.get('category')?.setValue(event.target.value)
  }

  getImagePath(event:any){
    const file = event.target.files[0];
    const reader= new FileReader();
    reader.readAsDataURL(file);
    reader.onload =() => {
      this.base64 = reader.result;
      this.ProductForm.get('image')?.setValue(this.base64)
    }
  }
  AddProduct(){
    let product:Product=this.ProductForm.value
    // this._AdminProductsService.AddNewProduct(product).subscribe({
    //   next: ()=>{
    //     this.products.push(product)
    //     this.msg="Product Added successfully";
    //     setTimeout(()=>{
    //     this.msg=''
    //     },1500)
    //   },
    //   error:(err)=>{
    //     console.log(err)
    //   }
    // })
    // console.log(this.AddProductForm.value)
  }

  update(product:Product){
    this.ProductForm.patchValue({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.images[0],
      category: product.category,
    })
    this.base64=product.images[0]
    this.currentProduct=product

  }

  UpdateProduct(){
    if(this.currentProduct){
      let currentIndex =this.products.findIndex((prd) => prd.id === this.currentProduct.id)
      let newValues = this.ProductForm.value
      this.products.splice(currentIndex,1,newValues)
      this.msg="Product updated successfully";
      setTimeout(()=>{
        this.msg=''
      },1500)
      this.ProductForm.patchValue({
      title: '',
      price: '',
      description: '',
      image: '',
      category: '',
    })
    this.base64=''
    }

  }
}
