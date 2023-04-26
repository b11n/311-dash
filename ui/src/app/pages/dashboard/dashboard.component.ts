import { Component } from '@angular/core';
import { FilterConfig, IssuesDataRow, TableRow } from '../../data/models';
import { DataServiceService } from '../../data/data-service.service';

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
  topIssuesLoading = false;
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
      this.tableLoading = false;
    });
  }

  private updateLineData() {
    this.chartLoading = true;
    this.dataService.fetchLineGraphData().then((data) => {
      this.CHART_DATA = {
        rows: data.map((row:ChartDataRow) => {
          return { ...row, date: new Date(row.date).toDateString() }
        })
      };
      this.chartLoading = false;
    })
  }

  private updateTopIssuesData() {
    this.topIssuesLoading = true;
    this.dataService.fetchTopIssuesData().then((data) => {
      this.ISSUES_DATA = data;
      this.topIssuesLoading = false;
    })
  }


}


