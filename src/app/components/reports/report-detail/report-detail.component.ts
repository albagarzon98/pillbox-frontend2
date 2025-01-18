import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { reportTypes } from 'src/app/const/reportTypes';
import { PharmacyRequest } from 'src/app/models/pharmacy-request';
import { PharmacyRequestService } from 'src/app/services/pharmacy-request.service';
import { ReportService } from 'src/app/services/report.service';
import { loader } from 'src/app/utils/swalUtils';
import Swal from 'sweetalert2';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { countOccurrences } from 'src/app/utils/chartUtils';
import { Reminder } from 'src/app/models/reminder';

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
  reportData: any[] = [];
  chartData: any[] = [];
  role: string;
  submitted: boolean = false;
  selectedToggle: string;

  // MatPaginator Inputs
  length: number = 10;
  pageSize: number = 10;
  pageIndex: number = 1;
  pageSizeOptions: number[] = [5, 10, 25];

  services = {
    pharmacyRequestService: this.pharmacyRequestService,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private pharmacyRequestService: PharmacyRequestService,
    public formBuilder: FormBuilder,
    private router: Router,
    private reportService: ReportService,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.paginatorIntl.itemsPerPageLabel = 'Items por página';
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      let reportName = params['name'];
      this.role = params['role'];
      this.report = reportTypes[reportName];
    });

    this.FormReport = this.formBuilder.group(
      this.createFormBuilderGroup()
    );
  }

  createFormBuilderGroup() {
    let group = {};

    if (this.report.hasPeriodfilter) {
      group = {
        createdStartDate: [''],
        createdEndDate: [''],
      }
    }
    if (this.report.serviceFunction === 'getReminderHistory' && this.role === 'paciente') {      
      group['loggedUser'] = ['true'];
    }

    this.report.filters.forEach(filter => {
      group[filter.formGroupName] = [''];
    });

    return group;
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex + 1;

    this.updateReportData();
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
    this.pageIndex = 1;
    this.submitted = true;
    if (form.invalid) { return; }

    this.updateReportData();
    this.report.chartType && this.updateChartData();
    this.selectedToggle = 'report';
  }

  private updateReportData() {
    loader();
    const formValues = this.createFormValuesObject();
    this.reportService[this.report.serviceFunction](formValues).subscribe(res => {
      this.reportData = this.mapToReportType(res.results);
      this.length = res.totalResults;
      Swal.close()
    }, err => {
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al cargar el reporte'
      });
    });
  }

  private updateChartData() {
    const formValuesWithoutPagination = this.createFormValuesObject(false);
    this.reportService[this.report.serviceFunction](formValuesWithoutPagination).subscribe(res => {
      let reportDataToMap = this.mapToReportType(res.results);
      this.chartData = this.mapDataToChart(reportDataToMap);
      Swal.close()
    }, err => {
      Swal.fire({
        icon: 'error',
        text: err.error.message,
        heightAuto: false,
        title: 'Error al cargar el gráfico'
      });
    });
  }

  mapToReportType(data: any[]) {
    return data.map(item => this.mapToObject(item));
  }

  mapToObject(obj: any) {
    const keys = Object.keys(obj);

    const result = this.createInstance();

    for (const key of keys) {
      if (obj.hasOwnProperty(key) && key in result) {
        if (result[key] instanceof Date) {
          result[key] = new Date(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }

    return result;
  }

  createInstance() {
    switch (this.report.model) {
      case PharmacyRequest:
        return new PharmacyRequest();
      case Reminder:
        return new Reminder();
      default:
        return null;
    }
  }

  createFormValuesObject(withPagination = true) {
    let formValues = {};

    if (withPagination) {
      formValues = {
        page: this.pageIndex,
        limit: this.pageSize
      };
    }

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

  getObjectKeys(object: any) {
    return Object.keys(object);
  }

  formatDate(date: Date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  formatDateIfDate(value: any): any {
    if (value instanceof Date) {
      const invalidDate = new Date(0); 
      if (value.getTime() === invalidDate.getTime()) {
        return "-";
      }
      return this.formatDate(value);
    }
      return value;
  }
  

  mapDataToChart(reportData: any[]): any[] {
    switch (this.report.chartType.name) {
      case "pieChart":
        return countOccurrences(reportData, this.report.chartType.propertyToCount);
      default:
        return null;
    }
  }
}
