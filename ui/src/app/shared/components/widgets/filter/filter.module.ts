import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [
    FilterComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [FilterComponent]
})
export class FilterModule { }
