import { Component,OnInit, Output,EventEmitter } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { NEIGHBORHOOD_LIST } from '../../../services/static_data';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';


interface FilterConfig {
  neighborhood: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Output() onFilterChange = new EventEmitter<FilterConfig|null>();
  selectedFilters: string[] = [];
  filterConfig: FilterConfig|null = null;
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(FilterDialog);

    dialogRef.afterClosed().subscribe((result:FilterConfig) => {
      if(result){
        this.refreshFilterList(result);
      }
    });
  }

  remove(selected: string) {
    this.selectedFilters = [];
    this.onFilterChange.emit(null);
  }

  private refreshFilterList(filterConfig: FilterConfig){
    this.selectedFilters = [filterConfig.neighborhood];
    this.onFilterChange.emit(filterConfig);
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'filter-dialog.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterDialog implements OnInit{
  myControl = new FormControl('');
  options: string[] = NEIGHBORHOOD_LIST;
  selectedNeighborhood: null|string = null;
  filteredOptions!: Observable<string[]>;

  constructor(private dialogRef: MatDialogRef<FilterDialog>) { }


  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  closeDialog() {
    this.dialogRef.close({neighborhood: this.selectedNeighborhood });
  }

  optionSelected(event: MatAutocompleteSelectedEvent){
    this.selectedNeighborhood = event.option.value;
  }
  
}
