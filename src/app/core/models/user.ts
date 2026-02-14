export interface UserProfile {
  uid?:number,
  userName:string,
  email:string,
  password:string,
  role?: UserRole
}
export type UserRole = 'guest' | 'user' | 'admin';
