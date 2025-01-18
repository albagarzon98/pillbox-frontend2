import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { loaderWithTime } from 'src/app/utils/swalUtils';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  role: string;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.role = this.authService.getRole();
  }

  navigateToReportDetail(name) {
    this.router.navigate(['/reports/reportDetail'], { 
      queryParams: { 
        name: name,
        role: this.role 
      } 
    });
  }

  route() {
    return this.router.url;
  }
}