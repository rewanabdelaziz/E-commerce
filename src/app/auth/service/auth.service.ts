import { Injectable , computed, inject , signal} from '@angular/core';
import { UserProfile, UserRole } from '../../core/models/user';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth)
  private firestore = inject(Firestore)
  private router = inject(Router)

  currentUser = signal<User | null> (null);
  userRole = signal<UserRole>('guest')
  isLoggedIn = computed(()=> !!this.currentUser())

  constructor() {
    // check if there is user already logged in
    user(this.auth).subscribe({
      next: async(u)=>{
        this.currentUser.set(u);
        if(u){
            await this.getUserRole(u.uid);
            const role = this.userRole()
            if (role === 'admin') {
            this.router.navigateByUrl('/admin');
            } else if (role === 'user') {
              this.router.navigateByUrl('/user');
            }
        }else{
          this.userRole.set('guest')
        }
      }
    })
  }
  
  
  // signUp
  async addNewUser(user:UserProfile){
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, user.email, user.password )
      const uid = credential.user.uid;
  
      await setDoc(doc(this.firestore, 'users', uid),{
        uid,
        userName: user.userName,
        email: user.email,
        role: 'user'
      })
  
      this.router.navigateByUrl('auth/login')
      
    } catch (error: any) {
      throw this.handleSignUpError(error.code)
    }
    
  }

   private handleSignUpError(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'email already used ';
      default:
        return `something wrong try again!`;
    }
  }

  // login
  async SignIn(email:string,password:string){
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password); //listen on user subscribe in constructor so no need to return
      await this.getUserRole(credential.user.uid);
      
      const role = this.userRole();
      this.router.navigateByUrl(role === 'admin' ? '/admin' : '/user');
    } catch (error: any) {
      throw this.handleLoginError(error.code);
    }
  }

  private handleLoginError(code: string): string {
    switch (code) {
      case 'auth/invalid-credential':
        return 'invalid email or password';
      case 'auth/user-not-found':
        return 'user not found';
      case 'auth/wrong-password':
        return 'wrong password';
      case 'auth/too-many-requests':
        return 'too many request, try again later';
      default:
        return 'something wrong try again';
    }
  }

  // get user's role
  private async getUserRole(uid:string){
    const userDoc = await getDoc(doc(this.firestore,'users',uid))

    if(userDoc.exists()){
      this.userRole.set(userDoc.data()['role'])
    }
  }

  logout() {
    this.currentUser.set(null);
    // localStorage.removeItem('user');
    return signOut(this.auth).then(() => this.router.navigate(['/auth/login']));
  }

}
