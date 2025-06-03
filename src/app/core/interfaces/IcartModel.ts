import { Iproduct } from "./iproduct";

export interface IcartModel {
  userId:number,
  date: Date,
  products: {
    productId:number,
    quantity:number
  }[]
}
