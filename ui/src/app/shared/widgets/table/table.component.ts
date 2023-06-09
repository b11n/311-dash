import { TableRow } from '../../../services/models';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Component, ViewChild, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @Input()
  set initialData(data: TableRow[]) {
    this.data = data;
    if(this.paginator){
      this.paginator.firstPage();
    }
  }

  @Input()
  data: TableRow[] = [];

  @Output()
  pageUpdate = new EventEmitter<number>();

  @Input()
  resultsLength = 1000;

  @Input()
  disableControls = false;
  
  displayedColumns: string[] = ['caseid', 'category', 'created', 'desc'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageChange(event: PageEvent) {
    this.pageUpdate.emit(event.pageIndex*10);
  }

}
