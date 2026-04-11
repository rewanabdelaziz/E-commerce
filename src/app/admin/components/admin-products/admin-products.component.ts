import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../user/services/products.service';
import { DecimalPipe, } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminProductsService } from '../../services/admin-products.service';
import { Category } from '../../../core/models/category';
import { Product, ProductPayload } from '../../../core/models/product';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { CategoryManagementsService } from '../../services/category-managements.service';
import { ImageFallbackDirective } from '../../../shared/directive/image-fallback.directive';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [ReactiveFormsModule,DecimalPipe,FormsModule,ImageFallbackDirective],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit,OnDestroy{

  private _AdminProductsService = inject(AdminProductsService);
  private _AdminCategoriesService = inject(CategoryManagementsService);
  products = this._AdminProductsService.products;
  Allcategories = this._AdminCategoriesService.categories().slice(0, 5);
  currentProduct:Product = {} as Product
  ProductForm!:FormGroup;
  selectedFile: File | null = null;
  base64:any=[];
  msg=signal('');
  modalMode = signal(''); 
  imageUrl = signal('');
  offset = signal(0);
  loadMore = signal(false);
  isSearching = signal(false);
  showModal = false;
  searchTerm = new Subject<string>();



  constructor(private _productService : ProductsService,
              private _fb:FormBuilder){}

  

  ngOnInit(): void {
    this.ProductForm=this._fb.group({
      title:['',Validators.required],
      price:['',Validators.required],
      description:['',Validators.required],
      image:['',Validators.required],
      category:[null,Validators.required],
    })


    this.searchTerm.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap( (term) => {
        if (term.trim() === '') {
          this.resetPagination();
          return this._productService.filterProductsByCategoryAndPrice(null, 0, 2000, 0);
        }
        return this._AdminProductsService.searchProductsByTitle(term);
      })
    ).subscribe(res => {
      this.products .set(res);
      this.loadMore.set(!this.isSearching() && res.length >= 9);
    });

    if(this.products().length < 9){
        this.loadMore.set(false)
      } else {
        this.loadMore.set(true)
    }

  }

  openModal(mode:string,product?:Product){
    if (mode === 'edit' && product) {
      this.showModal = true; 
      this.modalMode.set('edit');
      this.update(product);  
    } else {
      this.showModal = true; 
      this.modalMode.set('add');
      this.ProductForm.reset();
      this.base64 = '';
      this.currentProduct = {} as Product;
    }
  }

  closeModal(){
    this.showModal = false;
    this.ProductForm.reset(); 
    this.selectedFile = null;
    this.modalMode.set('');
    this.base64 = '';
    this.currentProduct = {} as Product;
  }

  getAllProducts(){
    this._productService.filterProductsByCategoryAndPrice(null, 0, 2000, this.offset()).subscribe({
      next: (res)=>{
        this.products.set([...this.products(), ...res]);
        if(res.length < 9){
          this.loadMore.set(false)
        } else {
          this.loadMore.set(true)
        }
      },
      error: (err)=>{
        console.log(err)
      }
    })
  }



  getImagePath(event: any){
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (e: any) => {
      this.base64 = e.target.result;
      this.ProductForm.get('image')?.setValue(this.base64);
    };
  }


  AddProduct(){
    this._AdminProductsService.uploadImage(this.selectedFile!).subscribe({
      next: (res)=>{
        this.imageUrl.set(res.location);
        const product:ProductPayload={
          title: this.ProductForm.value.title,
          price: this.ProductForm.value.price,
          description: this.ProductForm.value.description,  
          images: [this.imageUrl()],
          categoryId: this.ProductForm.value.category,
        }

        // console.log("product to add", product);
        this._AdminProductsService.addNewProduct(product).subscribe({
          next: ()=>{
            // this.products.push(product)
            this.msg.set("Product Added successfully");
            this.selectedFile = null;
            this.resetPagination();
            this.getAllProducts();
            this.closeModal();  
            setTimeout(()=>{
            this.msg.set('')
            },1500)
          },
          error:(err)=>{
            console.log(err)
    
            if (err.error?.message?.includes('slug')) {
              this.msg.set("This product title already exists. Please choose a unique title.");
            }else if(err.status === 413){
              this.msg.set(err.error.message || 'The uploaded image is too large. Please choose a smaller file.')
            } else {
              this.msg.set("An error occurred. Please try again.");
            }
          }
        })
      },
      error: (err)=>{
        console.log(err)
        this.msg.set('An error occurred while uploading the image. Please try again.')
      }
    })
  }

  update(product:Product){
    this.ProductForm.patchValue({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.images[0],
      category: product.category.id,
    })
    this.base64=product.images[0]
    this.currentProduct=product

  }
  
  
  UpdateProduct(){
    if(this.selectedFile){
      this._AdminProductsService.uploadImage(this.selectedFile!).subscribe({
      next: (res)=>{
        this.imageUrl.set(res.location);
        this.saveUpdatedProduct()

      },
      error: (err)=>{
        console.log(err)
        this.msg.set('An error occurred while uploading the image. Please try again.')
      }
      })
    } else {
      this.imageUrl.set(this.currentProduct.images[0])
      this.saveUpdatedProduct()
    }
  }

  saveUpdatedProduct(){
        const product:Product={
          ...this.currentProduct,
          title: this.ProductForm.value.title,
          price: this.ProductForm.value.price,
          description: this.ProductForm.value.description,  
          images: [this.imageUrl()],
          category: this.Allcategories.find(cat => cat.id === this.ProductForm.value.category)!,
          id: this.currentProduct.id
        }

        // console.log("product to edit", product);
        this._AdminProductsService.editProduct(this.currentProduct.id, product).subscribe({
          next: ()=>{
            // this.products.push(product)
            this.msg.set("Product Updated successfully");
            this.resetPagination();
            this.getAllProducts();
            this.closeModal();  
            setTimeout(()=>{
            this.msg.set('')
            },1500)
          },
          error:(err)=>{
            console.log(err)
    
            if(err.status === 400){
              this.msg.set(err.error.message || 'An error occurred while adding the product. Please try again.')
            }else if(err.status === 413){
              this.msg.set(err.error.message || 'The uploaded image is too large. Please choose a smaller file.')
            }
          }
        })
  }

  delete(id:number){
    this._AdminProductsService.deleteProduct(id).subscribe({
      next:()=>{
        this.msg.set("Product deleted successfully");
        this.resetPagination();
        this.getAllProducts();
        setTimeout(()=>{
          this.msg.set('')
        },1500)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
  
  filterByTitle(e:any){
    this.resetPagination();
    const title = (e.target as HTMLInputElement).value;
    this.searchTerm.next(title);
    this.isSearching.set(title.trim() !== '');

  }

  resetPagination() {
    this.offset.set(0);
    this.products .set([]);
    this.loadMore.set(false);
  }

  loadMoreProducts(){
    this.offset.update(value => value + 9);
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.searchTerm.complete();
  }



}