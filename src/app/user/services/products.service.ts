import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Iproduct } from '../../core/models/iproduct';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  docData,
  limit
} from '@angular/fire/firestore';
import { Category } from '../components/home-slider/home-slider.component';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, 'products');

  categories: Category[] = [
  
    {
      id: 1,
      name: "Men's Clothing",
      slug: "men's clothing",
      image: "https://images.pexels.com/photos/2988637/pexels-photo-2988637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      icon: "bi-gender-male"
    },
  {
    id: 2,
    name: "Women's Clothing",
    slug: "women's clothing",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    icon: "bi-gender-female"
  },
  {
    id: 3,
    name: "Electronics",
    slug: "electronics",
    image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    icon: "bi-laptop"
  },
  {
    id: 4,
    name: "Jewelry",
    slug: "jewelery",
    image: "https://images.pexels.com/photos/1457801/pexels-photo-1457801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    icon: "bi-gem"
  }
  ];

  getAllProducts(): Observable<Iproduct[]> {
    return collectionData(this.productsCollection, { idField: 'id' }) as Observable<Iproduct[]>;
  }

  getLimitedProducts(count: number = 5): Observable<Iproduct[]> {
    const q = query(this.productsCollection, limit(count));
    return collectionData(q, { idField: 'id' }) as Observable<Iproduct[]>;
  }

  getProductsByCategory(category: string): Observable<Iproduct[]> {
    const q = query(this.productsCollection, where('category', '==', category));
    return collectionData(q, { idField: 'id' }) as Observable<Iproduct[]>;
  }

  async addProduct(product: Iproduct) {
    const newDocRef = doc(this.productsCollection); // auto-generated ID
    return await setDoc(newDocRef, { ...product, id: newDocRef.id });
  }

  async deleteProduct(productId: string) {
    const docRef = doc(this.firestore, `products/${productId}`);
    return await deleteDoc(docRef);
  }

  getProductsById(id: string): Observable<Iproduct> {
  const productDocRef = doc(this.firestore, `products/${id}`);
  return docData(productDocRef, { idField: 'id' }) as Observable<Iproduct>;
  }

  getAllCategories(): Observable<string[]> {
    return this.getAllProducts().pipe(
      map(products => {
        const categories = products.map(p => p.category);
        return [...new Set(categories)];
      })
    );
  }


  baseurl=environment.apiUrl
  products={}

  constructor(private _httpclient: HttpClient) { }

  // getAllProducts():Observable<Iproduct[]>{
  // return this._httpclient.get<Iproduct[]>(`${this.baseurl}/products`)
  // }

  // getAllCategories():Observable<[]>{
  // return this._httpclient.get<[]>(`${this.baseurl}/products/categories`)
  // }

  // getProductsByCategory(category:string):Observable<Iproduct[]>{
  // return this._httpclient.get<Iproduct[]>(`${this.baseurl}/products/category/${category}`)
  // }

  // getProductsById(id:number):Observable<Iproduct>{
  // return this._httpclient.get<Iproduct>(`${this.baseurl}/products/${id}`)
  // }


}
