import { Component } from '@angular/core';
import { IssuesDataRow } from 'src/app/data/models';
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

  constructor(private readonly dataService: DataServiceService){
      this.updateData();
  }

  updateData() {
    this.loading = true;
    this.dataService.fetchData(this.fromDate,this.toDate).then((data)=>{
      if(data.chartData){
        this.CHART_DATA = {rows: data.chartData.map((row)=>{
          return {...row, date: new Date(row.date).toDateString()}
        })};
        this.loading = false;
      }

      if(data.topRequests) {
        this.ISSUES_DATA = data.topRequests;
      }
     
    })
  }
  

  loading = true;
  CHART_DATA: {rows: ChartDataRow[]} = {rows: []};
  ISSUES_DATA: IssuesDataRow[] = [];

  
}


