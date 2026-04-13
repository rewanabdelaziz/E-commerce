import { IcartProduct } from "./IcartProduct";

export interface Order {
  id?: string;
  customerName: string; 
  email: string;
  userId: number;
  items: IcartProduct[]; 
  totalPrice: number;
  status: Status;
  createdAt?: any; 

}

export type Status = 'pending' | 'shipped' | 'delivered';