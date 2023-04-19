import { Component } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();


@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent {
  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });
}
