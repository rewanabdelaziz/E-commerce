export interface IcartModel {
  userId:string | number,
  date: Date,
  products: {
    productId:number,
    quantity:number
  }[]
}