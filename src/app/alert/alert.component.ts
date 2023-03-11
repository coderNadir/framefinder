import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [],
})
export class AlertComponent implements OnInit {
  @Input() color: string = '';

  constructor() {}

  ngOnInit(): void {}

  get bgColor() {
    return `border-2 border-${this.color}-400 text-${this.color}-400`;
  }

  get animate() {
    return 'animate-shake';
  }
}
