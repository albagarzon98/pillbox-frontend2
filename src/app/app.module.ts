import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ReminderComponent } from './components/reminder/reminder.component';
import { FooterComponent } from './components/footer/footer.component';
import { PharmacyComponent } from './components/pharmacy/pharmacy.component';
import { PharmacyRegisterComponent } from './components/pharmacy-register/pharmacy-register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PharmacyRequestsComponent } from './components/pharmacy-requests/pharmacy-requests.component';
import { PharmacyAddComponent } from './components/pharmacy-add/pharmacy-add.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { AddMedicamentComponent } from './components/inventory/add-medicament/add-medicament.component';
import { InterceptorService } from './interceptors/interceptor.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { IconModule } from '../app/icon.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PharmacyProfileComponent } from './components/pharmacy/pharmacy-profile/pharmacy-profile.component';
import { BranchFormComponent } from './components/pharmacy/branch-form/branch-form.component';
import { AppointmentComponent, AppointmentDialog } from './components/appointment/appointment.component';
import { AppointmentFormComponent } from './components/appointment/appointment-form/appointment-form.component';
import { PatientsComponent } from './components/patients/patients.component';
import { UsersComponent } from './components/users/users.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReportDetailComponent } from './components/reports/report-detail/report-detail.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ChartsComponent } from './components/reports/charts/charts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartComponent } from './components/reports/charts/pie-chart/pie-chart.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    MenuComponent,
    HomepageComponent,
    ReminderComponent,
    FooterComponent,
    PharmacyRegisterComponent,
    PharmacyComponent,
    ProfileComponent,
    PharmacyRequestsComponent,
    PharmacyAddComponent,
    InventoryComponent,
    AddMedicamentComponent,
    PharmacyProfileComponent,
    BranchFormComponent,
    AppointmentComponent,
    AppointmentFormComponent,
    PatientsComponent,
    UsersComponent,
    ReportsComponent,
    ReportDetailComponent,
    ChartsComponent,
    PieChartComponent,
    AppointmentDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    IconModule,
    MatMenuModule,
    MatSelectModule,
    MatDividerModule,
    NgxMaskModule.forRoot(),
    GoogleMapsModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    NgxChartsModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
