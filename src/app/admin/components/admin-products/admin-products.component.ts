import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../user/services/products.service';
import { DecimalPipe, } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminProductsService } from '../../services/admin-products.service';
import { Product, ProductPayload } from '../../../core/models/product';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { CategoryManagementsService } from '../../services/category-managements.service';
import { ImageFallbackDirective } from '../../../shared/directive/image-fallback.directive';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, FormsModule, ImageFallbackDirective],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit, OnDestroy {

  private _AdminProductsService = inject(AdminProductsService);
  private _AdminCategoriesService = inject(CategoryManagementsService);
  products = this._AdminProductsService.products;
  
  Allcategories = computed(() => {
    const all = this._AdminCategoriesService.categories();
    if (all.length <= 10) return all;
    return [...all.slice(0, 6)];
  });

  currentProduct: Product = {} as Product
  ProductForm!: FormGroup;
  selectedFile: File | null = null;
  base64: any = [];
  msg = signal('');
  modalMode = signal('');
  imageUrl = signal('');
  offset = signal(0);
  loadMore = signal(false);
  isSearching = signal(false);
  showModal = false;
  searchTerm = new Subject<string>();

 
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#fff'
  });

  constructor(private _productService: ProductsService,
    private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.ProductForm = this._fb.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      category: [null, Validators.required],
    })

    this.searchTerm.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) => {
        if (term.trim() === '') {
          this.resetPagination();
          return this._productService.filterProductsByCategoryAndPrice(null, 0, 2000, 0);
        }
        return this._AdminProductsService.searchProductsByTitle(term);
      })
    ).subscribe(res => {
      this.products.set(res);
      this.loadMore.set(!this.isSearching() && res.length >= 9);
    });

    if (this.products().length < 9) {
      this.loadMore.set(false)
    } else {
      this.loadMore.set(true)
    }
  }

  openModal(mode: string, product?: Product) {
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

  closeModal() {
    this.showModal = false;
    this.ProductForm.reset();
    this.selectedFile = null;
    this.modalMode.set('');
    this.base64 = '';
    this.currentProduct = {} as Product;
  }

  getAllProducts() {
    this._productService.filterProductsByCategoryAndPrice(null, 0, 2000, this.offset()).subscribe({
      next: (res) => {
        this.products.set([...this.products(), ...res]);
        if (res.length < 9) {
          this.loadMore.set(false)
        } else {
          this.loadMore.set(true)
        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  getImagePath(event: any) {
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

  AddProduct() {
    this._AdminProductsService.uploadImage(this.selectedFile!).subscribe({
      next: (res) => {
        this.imageUrl.set(res.location);
        const product: ProductPayload = {
          title: this.ProductForm.value.title,
          price: this.ProductForm.value.price,
          description: this.ProductForm.value.description,
          images: [this.imageUrl()],
          categoryId: this.ProductForm.value.category,
        }

        this._AdminProductsService.addNewProduct(product).subscribe({
          next: () => {
            this.Toast.fire({ icon: 'success', title: 'Product Added successfully' });
            this.selectedFile = null;
            this.resetPagination();
            this.getAllProducts();
            this.closeModal();
          },
          error: (err) => {
            let errorText = "An error occurred. Please try again.";
            if (err.error?.message?.includes('slug')) {
              errorText = "This product title already exists.";
            } else if (err.status === 413) {
              errorText = "The uploaded image is too large.";
            }
            Swal.fire({ icon: 'error', title: 'Oops...', text: errorText, background: '#1e293b', color: '#fff' });
          }
        })
      },
      error: (err) => {
        this.Toast.fire({ icon: 'error', title: 'Image upload failed' });
      }
    })
  }

  update(product: Product) {
    this.ProductForm.patchValue({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.images[0],
      category: product.category.id,
    })
    this.base64 = product.images[0]
    this.currentProduct = product
  }

  UpdateProduct() {
    if (this.selectedFile) {
      this._AdminProductsService.uploadImage(this.selectedFile!).subscribe({
        next: (res) => {
          this.imageUrl.set(res.location);
          this.saveUpdatedProduct()
        },
        error: (err) => {
          this.Toast.fire({ icon: 'error', title: 'Image upload failed' });
        }
      })
    } else {
      this.imageUrl.set(this.currentProduct.images[0])
      this.saveUpdatedProduct()
    }
  }

  saveUpdatedProduct() {
    const product: Product = {
      ...this.currentProduct,
      title: this.ProductForm.value.title,
      price: this.ProductForm.value.price,
      description: this.ProductForm.value.description,
      images: [this.imageUrl()],
      category: this.Allcategories().find(cat => cat.id === this.ProductForm.value.category)!,
      id: this.currentProduct.id
    }

    this._AdminProductsService.editProduct(this.currentProduct.id, product).subscribe({
      next: () => {
        this.Toast.fire({ icon: 'success', title: 'Product Updated successfully' });
        this.resetPagination();
        this.getAllProducts();
        this.closeModal();
      },
      error: (err) => {
        let errorText = "An error occurred while updating.";
        if (err.status === 400) errorText = err.error.message;
        else if (err.status === 413) errorText = "Image is too large.";
        
        Swal.fire({ icon: 'error', title: 'Update Failed', text: errorText, background: '#1e293b', color: '#fff' });
      }
    })
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this product?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a855f7',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this._AdminProductsService.deleteProduct(id).subscribe({
          next: () => {
            this.Toast.fire({ icon: 'success', title: 'Product deleted successfully' });
            this.resetPagination();
            this.getAllProducts();
          },
          error: (err) => {
            Swal.fire({ icon: 'error', title: 'Error', text: 'An error occurred while deleting.', background: '#1e293b', color: '#fff' });
          }
        })
      }
    });
  }

  filterByTitle(e: any) {
    this.resetPagination();
    const title = (e.target as HTMLInputElement).value;
    this.searchTerm.next(title);
    this.isSearching.set(title.trim() !== '');
  }

  resetPagination() {
    this.offset.set(0);
    this.products.set([]);
    this.loadMore.set(false);
  }

  loadMoreProducts() {
    this.offset.update(value => value + 9);
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.searchTerm.complete();
  }

}