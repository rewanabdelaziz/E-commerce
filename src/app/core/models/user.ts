export interface UserProfile {
  id?:number,
  name:string,
  email:string,
  password:string,
  role?: UserRole,
  avatar: string
}
export type UserRole = 'customer' | 'guest' | 'admin';
