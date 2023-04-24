import {Input, Output, Component, EventEmitter } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';


@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent {

  @Input()
  set fromDate(value: string) {
    const today = new Date(value);
    this.campaignOne.patchValue({
      start: new Date(value)
    });
  }

  @Input()
  set toDate(value: string) {
    const today = new Date(value);
    this.campaignOne.patchValue({
      end: new Date(value)
    });
  }

  @Output() fromDateChange = new EventEmitter<string>();
  @Output() toDateChange = new EventEmitter<string>();
  @Output() valueChanged = new EventEmitter();


  campaignOne = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date()),
  });

  saveDate(){
    if(this.campaignOne.value.start && this.campaignOne.value.end){
      this.fromDateChange.emit(formatDate(this.campaignOne.value.start) );
      this.toDateChange.emit(formatDate(this.campaignOne.value.end) );
      this.valueChanged.emit();
    }
  }
}

function formatDate(date: Date):string {
  const dateOfMonth = date.getDate();
  const monthOfYear = date.getMonth()+1;
  return `${date.getFullYear()}-${monthOfYear < 10 ? '0'+monthOfYear: monthOfYear}-${dateOfMonth < 10 ? '0'+dateOfMonth: dateOfMonth}`;
}
