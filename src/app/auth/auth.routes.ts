import { Routes } from '@angular/router';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthlayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent},
      { path:'', redirectTo:'login',pathMatch:'full'}
    ]
  }
];
