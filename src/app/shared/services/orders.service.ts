import { inject, Injectable, signal } from '@angular/core';
import { Firestore, 
         collection,
         addDoc, 
         getDocs, 
         doc, 
         updateDoc, 
         deleteDoc, 
         query, 
         where, 
         getDoc, 
         Timestamp } from '@angular/fire/firestore';
import { Order } from '../../core/models/order';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private firestore = inject(Firestore);
  private ordersRef = collection(this.firestore, 'orders');
  private _auth = inject(AuthService);
  allOrders = signal<Order[]>([]);
  userOrders = signal<Order[]>([]);
  isLoading = signal<boolean>(false);
  
  constructor() { 
    this.initOrders();

    
  }

  // initialize orders for current user
  async initOrders() {
    if (this._auth.isLoggedIn() && this._auth.userRole() === 'customer') {

      const userId = this._auth.currentUser()?.id;
      if (userId) {
        this.getOrdersByUserId(userId).then(orders => this.userOrders.set(orders))
          .catch(error => console.error('Error fetching user orders:', error));
      }

    }else if(this._auth.isLoggedIn() && this._auth.userRole() === 'admin'){

      this.getOrders().then(orders => this.allOrders.set(orders))
      .catch(error => console.error('Error fetching orders:', error));

    }

  }

  
  // get all orders
  async getOrders(): Promise<Order[]> {
   this.isLoading.set(true);
   const querySnapshot = await getDocs(this.ordersRef);
    this.isLoading.set(false);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  }


  // get order by id
  async getOrderById(id: string): Promise<Order | null> {
    this.isLoading.set(true);
    const docRef = doc(this.firestore, 'orders', id);
    const docSnap = await getDoc(docRef);
    this.isLoading.set(false);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    } else {
      return null;
    }
  }

  // get orders by user id
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    this.isLoading.set(true);
    const q = query(this.ordersRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    this.isLoading.set(false);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  }

  // create new order
  async newOrder  (order: Omit<Order, 'id'>): Promise<string> {
    this.isLoading.set(true);
    const docRef = await addDoc(this.ordersRef, {
      ...order,
      status: 'pending',
      createdAt: Timestamp.now() 
    });
    this.isLoading.set(false);
    return docRef.id;
  }



  // update order status
  async updateOrder(id: string, data: Partial<Order>): Promise<void> {
    this.isLoading.set(true);
    const docRef = doc(this.firestore, 'orders', id);
    await updateDoc(docRef, data);
    this.isLoading.set(false);
  }

  // delete order
  async deleteOrder(id: string): Promise<void> {
    this.isLoading.set(true);
    const docRef = doc(this.firestore, 'orders', id);
    await deleteDoc(docRef);
    this.isLoading.set(false);
  }
 
  // filter orders by status
  async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    this.isLoading.set(true);
    const q = query(this.ordersRef, where("status", "==", status));
    const querySnapshot = await getDocs(q);
    this.isLoading.set(false);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  }



}
