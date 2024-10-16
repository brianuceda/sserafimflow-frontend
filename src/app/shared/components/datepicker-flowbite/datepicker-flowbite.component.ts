import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DatepickerOptions } from '../../data-access/models/datepicker-options.model';
import { Datepicker } from 'flowbite-datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-datepicker-flowbite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datepicker-flowbite.component.html',
  styleUrl: './datepicker-flowbite.component.scss'
})
export class DatepickerFlowbiteComponent {
  @Input() label?: string; // ? OPCIONAL
  @Input() customStyle: 'dark' | 'default' = 'default'; // ? OPCIONAL

  @Input() startToday?: boolean = false;
  @Input() startDate?: string;
  @Input() customConfig?: DatepickerOptions;

  @ViewChild('datepicker', { static: true }) datepicker!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {

    let defaultConfig: DatepickerOptions = {
      autohide: true,
      format: 'dd/mm/yyyy',
      orientation: 'auto',
      clearBtn: true,
      todayBtn: true,
      todayBtnMode: 1,
      weekStart: 1,
      defaultViewDate: new Date().toLocaleDateString('es-ES'),
    };

    let modifiedOptions = { ...defaultConfig, ...this.customConfig };

    let datepicker = new Datepicker(this.datepicker.nativeElement, modifiedOptions);

    if (this.startToday === true) {
      datepicker?.setDate(new Date().toLocaleDateString('es-ES'));
    }

    if (this.startDate) {
      datepicker?.setDate(this.startDate);
    }
  }
}
