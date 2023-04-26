import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() loading = false;
  @Input() cardHeader = '';
  @Input() loadError = false;
  @Output() retry = new EventEmitter();

  retryLoad() {
    console.log(this);
    this.retry.emit();
  }
}
