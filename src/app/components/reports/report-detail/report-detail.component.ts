import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { reportTypes } from 'src/app/const/reportTypes';
import { PharmacyRequestService } from 'src/app/services/pharmacy-request.service';
import { ReportService } from 'src/app/services/report.service';
import { loader } from 'src/app/utils/swalUtils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css']
})
export class ReportDetailComponent implements OnInit {

  FormReport: FormGroup;
  report: any;
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
    private router: Router,
    private reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let reportName = params['name'];
      this.report = reportTypes[reportName];
    });

    this.FormReport = this.formBuilder.group(
      this.createFormBuilderGroup()
    );
  }

  createFormBuilderGroup() {
    let group = {}

    if (this.report.hasPeriodfilter) {
      group = {
        createdStartDate: [''],
        createdEndDate: [''],
      }
    }

    this.report.filters.forEach(filter => {
      group[filter.formGroupName] = [''];
    });

    return group;
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

  onSubmit(form: FormGroup) {
    this.submitted = true;
    if (form.invalid) { return; }

    const formValues = this.createFormValuesObject();

    loader();
    this.reportService.getPharmacyRequests(formValues).subscribe(res => {
      console.log("EXITO!!!", res)
      Swal.close();
    }, err => {
      console.log("ERROR!!!", err)
    });
  }

  createFormValuesObject() {
    let formValues = {};

    const keys = Object.keys(this.FormReport.controls);

    for (let i = 0; i < keys.length; i++) {
      const control = this.FormReport.get(keys[i]);
      if (control.value) {
        if (moment.isMoment(control.value)) {
          formValues[keys[i]] = control.value.format("YYYY-MM-DD");
          continue;
        }
        formValues[keys[i]] = control.value;
      }
    }

    return formValues;
  }
}
