export interface UserProfile {
  uid?:number,
  userName:string,
  email:string,
  password:string,
  role: 'admin' | 'user'
}
