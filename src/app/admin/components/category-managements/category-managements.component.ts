import { Component, computed, inject, signal } from '@angular/core';
import { Category } from '../../../core/models/category';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../user/services/products.service';
import { AdminProductsService } from '../../services/admin-products.service';
import { CategoryManagementsService } from '../../services/category-managements.service';
import { ImageFallbackDirective } from '../../../shared/directive/image-fallback.directive';
import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-category-managements',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ImageFallbackDirective],
  templateUrl: './category-managements.component.html',
  styleUrl: './category-managements.component.css'
})
export class CategoryManagementsComponent {
  private _AdminCategoriesService = inject(CategoryManagementsService);
  
  categories = computed(() => {
    const all = this._AdminCategoriesService.categories();
    if (all.length <= 10) return all; 
    return [...all.slice(0, 6), ...all.slice(-6)];
  });

  currentcategory: Category = {} as Category;
  categoryForm!: FormGroup;
  selectedFile: File | null = null;
  base64: any = [];
  msg = signal('');
  deleteMsg = signal('');
  modalMode = signal(''); 
  imageUrl = signal('');
  showModal = false;

 
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: '#1e293b',
    color: '#fff'
  });

  constructor(private _fb: FormBuilder, 
              private _AdminProductsService: AdminProductsService,
              ) {}

  ngOnInit(): void {
    this.categoryForm = this._fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  openModal(mode: string, category?: Category) {
    if (mode === 'edit' && category) {
      this.showModal = true; 
      this.modalMode.set('edit');
      this.update(category);  
    } else {
      this.showModal = true; 
      this.modalMode.set('add');
      this.categoryForm.reset();
      this.base64 = '';
      this.currentcategory = {} as Category;
    }
  }

  closeModal() {
    this.showModal = false;
    this.categoryForm.reset(); 
    this.selectedFile = null;
    this.modalMode.set('');
    this.base64 = '';
    this.currentcategory = {} as Category;
  }

  getImagePath(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (e: any) => {
      this.base64 = e.target.result;
      this.categoryForm.get('image')?.setValue(this.base64);
    };
  }

  AddCat() {
    this._AdminProductsService.uploadImage(this.selectedFile!).subscribe({
      next: (res) => {
        this.imageUrl.set(res.location);
        const category = {
          name: this.categoryForm.value.name,
          slug: this.categoryForm.value.slug,
          image: this.imageUrl(),
        };

        this._AdminCategoriesService.addNewCategory(category.name, category.image).subscribe({
          next: () => {
            this.Toast.fire({ icon: 'success', title: 'Category Added successfully' });
            this.selectedFile = null;
            this._AdminCategoriesService.getAllcats();
            this.closeModal();  
          },
          error: (err) => {
            let errorMessage = "An error occurred. Please try again.";
            if (err.error?.message?.includes('slug')) {
              errorMessage = "This category name already exists.";
            } else if (err.status === 413) {
              errorMessage = "The uploaded image is too large.";
            }
            Swal.fire({ icon: 'error', title: 'Oops...', text: errorMessage, background: '#1e293b', color: '#fff' });
          }
        });
      },
      error: (err) => {
        this.Toast.fire({ icon: 'error', title: 'Image upload failed' });
      }
    });
  }

  update(category: Category) {
    this.categoryForm.patchValue({
      name: category.name,
      slug: category.slug,
      image: category.image,
    });
    this.base64 = category.image;
    this.currentcategory = category;
  }
  
  Updatecat() {
    if (this.selectedFile) {
      this._AdminProductsService.uploadImage(this.selectedFile!).subscribe({
        next: (res) => {
          this.imageUrl.set(res.location);
          this.saveUpdatedCategory();
        },
        error: (err) => {
          this.Toast.fire({ icon: 'error', title: 'Image upload failed' });
        }
      });
    } else {
      this.imageUrl.set(this.currentcategory.image);
      this.saveUpdatedCategory();
    }
  }

  saveUpdatedCategory() {
    const category: Category = {
      ...this.currentcategory,
      name: this.categoryForm.value.name,
      slug: this.categoryForm.value.slug,
      image: this.imageUrl(),
      id: this.currentcategory.id
    };
    this._AdminCategoriesService.editCategory(category).subscribe({
      next: () => {
        this.Toast.fire({ icon: 'success', title: 'Category Updated successfully' });
        this._AdminCategoriesService.categories.update(old => old.map(c => c.id === category.id ? category : c));
        this.closeModal();  
      },
      error: (err) => {
        let errorMessage = "An error occurred while updating.";
        if (err.status === 400) errorMessage = err.error.message;
        else if (err.status === 413) errorMessage = "Image is too large.";
        
        Swal.fire({ icon: 'error', title: 'Update Failed', text: errorMessage, background: '#1e293b', color: '#fff' });
      }
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#a855f7',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      background: '#1e293b',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this._AdminCategoriesService.deleteCategory(id).subscribe({
          next: () => {
            this.Toast.fire({ icon: 'success', title: 'Deleted successfully' });
            this._AdminCategoriesService.categories.update(old => old.filter(c => c.id !== id));
          },
          error: (err) => {
            let errorMsg = 'An error occurred while deleting.';
            if (err.status === 400 && err.error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
              errorMsg = 'Cannot delete category associated with existing products.';
            }
            Swal.fire({ icon: 'error', title: 'Error', text: errorMsg, background: '#1e293b', color: '#fff' });
          }
        });
      }
    });
  }
}