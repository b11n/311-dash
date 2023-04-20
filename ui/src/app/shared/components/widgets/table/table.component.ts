import { TableRow } from 'src/app/data/models';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Component, ViewChild, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @Input()
  data: TableRow[] = [];

  @Output()
  pageUpdate = new EventEmitter<number>();

  resultsLength = 1000;
  displayedColumns: string[] = ['caseid', 'category', 'created', 'desc'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageChange(event: PageEvent) {
    this.pageUpdate.emit(event.pageIndex*10);
  }

}
