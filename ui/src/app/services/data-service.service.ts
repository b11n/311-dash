import { Injectable } from '@angular/core';
import * as qs from 'qs';
import { ChartDataRow, IssuesDataRow, TableRow } from './models';

const DATA_END_POINT = "https://us-central1-cal-311.cloudfunctions.net/"

interface TableResponse {
  rows: TableRow[],
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {


  from = '';
  to = '';
  neighbourhood = '';

  setDateFilter(from: string, to: string) {
    this.from = from;
    this.to = to;
  }

  setNeighbourhoodFilter(neighbourhood: string | null) {
    this.neighbourhood = neighbourhood === null ? "" : neighbourhood;
  }

  fetchLineGraphData() {
    return this.executeRPC('/api/linechart');
  }

  fetchTopIssuesData() {
    return this.executeRPC('/api/topissues');
  }

  async fetchTableData(offset: number) {
    const response = await this.executeTableRPC(offset) as TableResponse;
    return response;
  }

  private async executeRPC(url: string) {
    const qsString = qs.stringify({
      from: this.from, to: this.to, neighbourhood: this.neighbourhood
    })
    const response = await fetch(DATA_END_POINT+ url + '?' + qsString);
    const jsonData = await response.json();
    return jsonData;
  }

  private async executeTableRPC(offset: number) {
    const qsString = qs.stringify({
      from: this.from, to: this.to, neighbourhood: this.neighbourhood, offset
    })
    const response = await fetch(DATA_END_POINT+ "/api/table?" + qsString);
    const jsonData = await response.json();
    return jsonData;
  }
}
