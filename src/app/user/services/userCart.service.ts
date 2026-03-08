import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IcartModel } from '../../core/models/IcartModel';
import { Product } from '../../core/models/product';

@Injectable({
  providedIn: 'root'
})
export class UserCartService {
  baseurl=environment.apiUrl
  cart = signal<{item:Product,quantity:number}[]>([])

 constructor(private _httpclient: HttpClient) {

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart.set(JSON.parse(savedCart));
    }
  }

  createNewCart(model:IcartModel){
    return this._httpclient.post(`${this.baseurl}/carts`,model)
  }

  

  addToCart(prd: Product, quantity: number = 1) {
  
    const currentCart = this.cart();
    

    const existingItem = currentCart.find(prod => prod.item.id === prd.id);

    if (existingItem) {
 
      existingItem.quantity += quantity;
      this.cart.set([...currentCart]); 
    } else {

      this.cart.update(prevCart => [...prevCart, { item: prd, quantity: quantity }]);
    }


    localStorage.setItem('cart', JSON.stringify(this.cart()));
  }
  

}
