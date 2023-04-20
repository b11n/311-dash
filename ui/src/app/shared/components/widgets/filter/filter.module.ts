import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FilterComponent, FilterDialog } from './filter.component';

@NgModule({
  declarations: [
    FilterComponent,
    FilterDialog,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatChipsModule,
    MatFormFieldModule,
  ],
  exports: [FilterComponent]
})
export class FilterModule { }
