export interface IOrder {
  orderId?: string;
  userId: string;
  date: any;
  totalPrice: number;
  status: 'pending' | 'delivered' | 'cancelled';
  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
  }[];
}