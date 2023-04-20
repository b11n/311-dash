import { Component } from '@angular/core';
import { FilterConfig, IssuesDataRow, TableRow } from 'src/app/data/models';
import {DataServiceService} from '../../data/data-service.service';

interface ChartDataRow{
  date: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  fromDate = '2023-02-01';
  toDate = '2023-03-03';
  selectedNeighbourhood : string|null = null;
  loading = true;
  CHART_DATA: {rows: ChartDataRow[]} = {rows: []};
  ISSUES_DATA: IssuesDataRow[] = [];
  TABLE_DATA: TableRow[] = [];
  TABLE_INITIAL_DATA: TableRow[] = [];
  tableLoading = false;
  totalCount = 0;

  constructor(private readonly dataService: DataServiceService){
      this.updateData();
  }

  updateFilters(event: FilterConfig|null) {
    this.selectedNeighbourhood = event === null ? null : event.neighborhood;
    this.updateData();
  }

  pageUpdate(event: number) {
    this.tableLoading = true;
    this.dataService.fetchTablePage(event).then((data)=>{
      this.TABLE_DATA = data.rawData;
      this.tableLoading = false;
    });
  }

  updateData() {
    this.loading = true;
    this.dataService.fetchData(this.fromDate,this.toDate, this.selectedNeighbourhood).then((data)=>{
      if(data.chartData){
        this.CHART_DATA = {rows: data.chartData.map((row)=>{
          return {...row, date: new Date(row.date).toDateString()}
        })};
        this.loading = false;
      }

      if(data.topRequests) {
        this.ISSUES_DATA = data.topRequests;
      }

      if(data.rawData) {
        this.TABLE_INITIAL_DATA = data.rawData.data;
        this.totalCount = data.rawData.count;
      }
     
    })
  }

  
}


