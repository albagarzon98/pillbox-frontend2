import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { reportTypes } from 'src/app/const/reportTypes';
import { PharmacyRequestService } from 'src/app/services/pharmacy-request.service';
import { loader } from 'src/app/utils/swalUtils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css']
})
export class ReportDetailComponent implements OnInit {

  FormReport: FormGroup;
  reportName: string;
  title: string;
  minDate: Date;
  maxDate: Date = new Date();

  submitted: boolean = false;

  services = {
    pharmacyRequestService: this.pharmacyRequestService,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private pharmacyRequestService: PharmacyRequestService,
    public formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.reportName = params['name'];
    });

    this.title = reportTypes[this.reportName].title;

    this.FormReport = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
    });
  }

  minDateFilter = (date: Date | null): boolean => {
    if (this.maxDate) {
      return !date || date <= this.maxDate;
    }
    return !date || date <= new Date();
  }

  maxDateFilter = (date: Date | null): boolean => {

    if (this.minDate) {
      return !date || (date >= this.minDate && date <= new Date());
    }
    return !date || date <= new Date();
  }

  startDateChanged(event: any) {
    this.minDate = event.value;
  }

  endDateChanged(event: any) {
    this.maxDate = event.value;
  }

  route() {
    return this.router.url;
  }

}
