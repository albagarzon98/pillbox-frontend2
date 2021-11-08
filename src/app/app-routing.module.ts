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
import { PharmacyRequestsComponent } from './components/pharmacy-requests/pharmacy-requests.component';
import { PharmacyAddComponent } from './components/pharmacy-add/pharmacy-add.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AddMedicamentComponent } from './components/inventory/add-medicament/add-medicament.component';
import { PharmacyProfileComponent } from './components/pharmacy/pharmacy-profile/pharmacy-profile.component';
import { BranchFormComponent } from './components/pharmacy/branch-form/branch-form.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { AppointmentFormComponent } from './components/appointment/appointment-form/appointment-form.component';



const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'pharmacyRegister', component: PharmacyRegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'reminder', component: ReminderComponent,
    canActivate: [ AuthGuard ],
    data: {
      role: ['paciente', 'tutor']
    }
  },
  { path: 'pharmacy', component: PharmacyComponent, 
    canActivate: [ AuthGuard ],
    data: {
      role: ['paciente', 'tutor', 'admin']
    },
    canActivateChild: [AuthGuard],
    children: [
      {path: 'profile', component: PharmacyProfileComponent},
      {path: 'addBranch', component: BranchFormComponent}
    ]
  },  
  { path: 'pharmacyRequests', component: PharmacyRequestsComponent,
  canActivate: [ AuthGuard ],
  data: {
    role: ['admin']
  },
  canActivateChild: [AuthGuard],
  children: [
    {path: 'add', component: PharmacyAddComponent}
  ]
},
{
  path: 'inventory', component: InventoryComponent,
  canActivate: [AuthGuard],
  data: {
    role: ['farmaceutico']
  },
  canActivateChild: [AuthGuard],
  children: [
    {path: 'addMedicament', component: AddMedicamentComponent}
  ]
}, 
{
  path: 'appointment', component: AppointmentComponent,
  canActivate: [AuthGuard],
  data: {
    role: ['farmaceutico']
  },
  canActivateChild: [AuthGuard],
  children: [
    {path: 'addAppointment', component: AppointmentFormComponent}
  ]
},
  { path:'**', redirectTo:'homepage' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
