import { CartItem } from "./cart";

export interface IOrder {
  orderId?: string;
  userId: string;
  date: any;
  totalPrice: number;
  status: 'pending' | 'delivered' | 'cancelled';
  items:CartItem[]
}