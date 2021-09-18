import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivateChild } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { PharmacyRegisterComponent } from './components/pharmacy-register/pharmacy-register.component';
import { PharmacyComponent } from './components/pharmacy/pharmacy.component';
import { ProfileComponent } from './components/profile/profile.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  // { path: 'reminder', component: ReminderComponent, canActivate: [ AuthGuard ] },
  // { path: 'pharmacy', component: PharmacyComponent, canActivate: [ AuthGuard ] },
  { path: 'homepage', component: HomepageComponent },
  { path: 'pharmacyRegister', component: PharmacyRegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { 
    path: 'home', component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild:  [AuthGuard],
    data: {
      role: 'paciente'
    },
    children: [
      {
        path: 'reminder', component: ReminderComponent
      },
      {
        path: 'pharmacy', component: PharmacyComponent
      }
    ]
  },  
  {
    path: 'homeAdmin', component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    }
  },
  {
    path: 'homeTutor', component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'tutor'
    }
  },
  {
    path: 'homePharmacist', component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'farmaceutico'
    }
  },
  { path:'**', redirectTo:'homepage' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
