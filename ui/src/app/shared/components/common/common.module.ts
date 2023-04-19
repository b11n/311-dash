import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card/card.component';
import {MatCardModule} from '@angular/material/card';
import { DateRangeComponent } from './date-range/date-range.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';


@NgModule({
  declarations: [
    CardComponent,
    DateRangeComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
  ],
  exports: [
    CardComponent,
    DateRangeComponent
  ]
})
export class CommonComponentsModule { }
