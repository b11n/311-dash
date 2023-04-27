import { Component } from '@angular/core';
import { FilterConfig, IssuesDataRow, TableRow } from '../../services/models';
import { DataServiceService } from '../../services/data-service.service';

interface ChartDataRow {
  date: string;
  count: number;
}


interface TableData {
  count: number;
  rows: TableRow[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  fromDate = '2023-02-01';
  toDate = '2023-03-03';
  selectedNeighbourhood: string | null = null;
  CHART_DATA: { rows: ChartDataRow[] } = { rows: [] };
  ISSUES_DATA: IssuesDataRow[] = [];
  TABLE_DATA: TableRow[] = [];
  TABLE_INITIAL_DATA: TableRow[] = [];
  tableLoading = false;
  tableLoadError = false;
  topIssuesLoading = false;
  topIssuesLoadError = false;
  totalCount = 0;

  chartLoading = true;

  constructor(private readonly dataService: DataServiceService) {
    this.updateDate();
  }

  updateFilters(event: FilterConfig | null) {
    this.selectedNeighbourhood = event === null ? null : event.neighborhood;
    this.dataService.setNeighbourhoodFilter(this.selectedNeighbourhood);
    this.updateData();
  }

  updateDate() {
    this.dataService.setDateFilter(this.fromDate, this.toDate);
    this.updateData();
  }

  pageUpdate(event: number) {
    this.updateTableData(event);
  }

  retryTopIssues() {
    this.updateTopIssuesData();
  }

  retryTable() {
    this.updateTableData();
  }

  updateData() {
    this.updateLineData();
    this.updateTableData();
    this.updateTopIssuesData();
  }

  private updateTableData(offset=0) {
    this.tableLoading = true;
    this.dataService.fetchTableData(offset).then((data: TableData)=>{
      if(offset === 0) {
        this.TABLE_INITIAL_DATA = data.rows;
        this.totalCount = data.count;
      }else {
        this.TABLE_DATA = data.rows;
      }
      this.tableLoadError = false;
    }).catch(()=>{
      this.tableLoadError = true;
    }).finally(()=>{
      this.tableLoading = false;
    })
  }

  private updateLineData() {
    this.chartLoading = true;
    this.dataService.fetchLineGraphData().then((data) => {
      this.CHART_DATA = {
        rows: data.map((row:ChartDataRow) => {
          return { ...row, date: this.formatDate(row.date) }
        })
      };
      this.chartLoading = false;
    })
  }

  private updateTopIssuesData() {
    this.topIssuesLoading = true;
    this.dataService.fetchTopIssuesData().then((data) => {
      this.ISSUES_DATA = data;
      this.topIssuesLoadError = false;
    }).catch((error)=>{
      this.topIssuesLoadError = true;
    }).finally(()=>{
      this.topIssuesLoading = false;
    });
  }

  private formatDate(date:string) {
    let interval = this.getIntervalForLine();
    let dateObj = new Date(date);
    switch(interval) {
      case 'day':
        return dateObj.toDateString();
      case 'month':
        return dateObj.toLocaleString('default', { month: 'long' }) + " - " +dateObj.getFullYear();
      case 'year':
        return dateObj.getFullYear();
      default:
        return dateObj.toDateString();
    }

  }

  private getIntervalForLine() {
    const fromDate = new Date(this.fromDate).getTime();
    const toDate = new Date(this.toDate).getTime();
  
    const diff = toDate-fromDate;
  
    if(diff < 7776000000) {
        return 'day';
    }else if (diff < 31536000000) {
        return 'month';
    }else {
        return 'year';
    }
  }


}



