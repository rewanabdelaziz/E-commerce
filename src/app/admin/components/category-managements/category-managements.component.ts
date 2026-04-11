import { Component, computed, inject, signal } from '@angular/core';
import { Category } from '../../../core/models/category';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductsService } from '../../../user/services/products.service';
import { AdminProductsService } from '../../services/admin-products.service';
import { CategoryManagementsService } from '../../services/category-managements.service';
import { ImageFallbackDirective } from '../../../shared/directive/image-fallback.directive';

@Component({
  selector: 'app-category-managements',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,ImageFallbackDirective],
  templateUrl: './category-managements.component.html',
  styleUrl: './category-managements.component.css'
})
export class CategoryManagementsComponent {
  private _AdminCategoriesService = inject(CategoryManagementsService);
  // categories = this._AdminCategoriesService.categories;
  categories = computed(() => {
    const all = this._AdminCategoriesService.categories();
    if (all.length <= 10) return all; 
    return [...all.slice(0, 6), ...all.slice(-6)];
  });
  currentcategory:Category = {} as Category
  categoryForm!:FormGroup;
  selectedFile: File | null = null;
  base64:any=[];
  msg=signal('');
  deleteMsg = signal('');
  modalMode = signal(''); 
  imageUrl = signal('');
  // offset = signal(0);
  // loadMore = signal(false);
 
  showModal = false;


  constructor(private _productService : ProductsService,
              private _fb:FormBuilder, 
              private _AdminProductsService: AdminProductsService,
              private _userProductsService: ProductsService){
 
              }

  

  ngOnInit(): void {
    this.categoryForm=this._fb.group({
      name:['',Validators.required],
      slug:['',Validators.required],
      image:['',Validators.required],
    })


  }

  openModal(mode:string,category?:Category){
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

  closeModal(){
    this.showModal = false;
    this.categoryForm.reset(); 
    this.selectedFile = null;
    this.modalMode.set('');
    this.base64 = '';
    this.currentcategory = {} as Category;
  }



  // getAllcats(){
  //   this._AdminCategoriesService.getAllCategories().subscribe({
  //   next: (res) =>{
  //     const newCats = res as Category[];
  //     this.categories.set(newCats);
  //     // if (this.offset() === 0) {
  //     //   this.categories.set(newCats);
  //     // } else {
  //     //   this.categories.update(old => [...old, ...newCats]);
  //     // }

  //     // this.loadMore.set(newCats.length === 10);
  //   },
  //   error: (err) =>{
  //     console.log(err)
  //   }
  // })
  // }


  getImagePath(event: any){
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


  AddCat(){
    this._AdminProductsService.uploadImage(this.selectedFile!).subscribe({
      next: (res)=>{
        this.imageUrl.set(res.location);
        const category={
          name: this.categoryForm.value.name,
          slug: this.categoryForm.value.slug,
          image: this.imageUrl(),
        }


        this._AdminCategoriesService.addNewCategory(category.name,category.image).subscribe({
          next: ()=>{
            this.msg.set("Category Added successfully");
            this.selectedFile = null;
            // this.resetPagination();
            this._AdminCategoriesService.getAllcats();
            // this.categories.update(old => [...old, category as Category]);
            this.closeModal();  
            setTimeout(()=>{
            this.msg.set('')
            },1500)
          },
          error:(err)=>{
            // console.log(err)
    
            if (err.error?.message?.includes('slug')) {
              this.msg.set("This category name already exists. Please choose a unique name.");
            }else if(err.status === 413){
              this.msg.set(err.error.message || 'The uploaded image is too large. Please choose a smaller file.')
            } else {
              this.msg.set("An error occurred. Please try again.");
            }
          }
        })
      },
      error: (err)=>{
        // console.log(err)
        this.msg.set('An error occurred while uploading the image. Please try again.')
      }
    })
  }

  update(category:Category){
    this.categoryForm.patchValue({
      // id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
    })
    this.base64=category.image
    this.currentcategory=category

  }
  
  
  Updatecat(){
    if(this.selectedFile){
      this._AdminProductsService.uploadImage(this.selectedFile!).subscribe({
      next: (res)=>{
        this.imageUrl.set(res.location);
        this.saveUpdatedCategory()

      },
      error: (err)=>{
        // console.log(err)
        this.msg.set('An error occurred while uploading the image. Please try again.')
      }
      })
    } else {
      this.imageUrl.set(this.currentcategory.image)
      this.saveUpdatedCategory()
    }
  }

  saveUpdatedCategory(){
        const category:Category={
          ...this.currentcategory,
          name: this.categoryForm.value.name,
          slug: this.categoryForm.value.slug,
          image: this.imageUrl(),
          id: this.currentcategory.id
        }
        this._AdminCategoriesService.editCategory(category).subscribe({
          next: ()=>{
            this.msg.set("Category Updated successfully");
            // this.resetPagination();
            // this.categories.update(old => old.map(c => c.id === category.id ? category : c));
            this._AdminCategoriesService.categories.update(old => old.map(c => c.id === category.id ? category : c));

            this.closeModal();  
            setTimeout(()=>{
            this.msg.set('')
            },1500)
          },
          error:(err)=>{
            // console.log(err)
    
            if(err.status === 400){
              this.msg.set(err.error.message || 'An error occurred while adding the product. Please try again.')
            }else if(err.status === 413){
              this.msg.set(err.error.message || 'The uploaded image is too large. Please choose a smaller file.')
            }
          }
        })
  }

  delete(id:number){
    this._AdminCategoriesService.deleteCategory(id).subscribe({
      next:()=>{
        this.deleteMsg.set("Category deleted successfully");
        // this.resetPagination();
      //  this.categories.update(old => old.filter(c => c.id !== id));
        this._AdminCategoriesService.categories.update(old => old.filter(c => c.id !== id));
        setTimeout(()=>{
          this.deleteMsg.set('')
        },1500)
      },
      error:(err)=>{
        if (err.status === 400 && err.error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
          this.deleteMsg.set('Cannot delete this category because it is associated with existing products. Please remove or reassign those products before deleting the category.');
        } else {
          // console.log(err);
          this.deleteMsg.set('An error occurred while deleting the category. Please try again.');
        }
      }
    })
  }
  


  // resetPagination() {
  //   this.offset.set(0);
  //   this.categories.set([]);
  //   this.loadMore.set(false);
  // }

  // loadMoreProducts(){
  //   this.offset.update(value => value + 10);
  //   this.getAllcats();
  // }



}
