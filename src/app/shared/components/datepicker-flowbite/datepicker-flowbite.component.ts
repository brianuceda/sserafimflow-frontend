import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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
  @Input() disabled: boolean = false;

  @Output() dateChanged = new EventEmitter<string>();

  @ViewChild('datepicker', { static: true }) datepicker!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    let defaultConfig: DatepickerOptions = {
      autohide: true,
      // 2024-12-19
      format: 'dd/mm/yyyy',
      orientation: 'auto',
      clearBtn: true,
      todayBtn: true,
      todayBtnMode: 1,
      weekStart: 1,
      defaultViewDate: new Date().toLocaleDateString('es-ES'),
    };

    let modifiedOptions = { ...defaultConfig, ...this.customConfig };

    const datepickerInstance = new Datepicker(this.datepicker.nativeElement, modifiedOptions);

    this.datepicker.nativeElement.addEventListener('changeDate', (event: any) => {
      this.dateChanged.emit(event.target.value);
    });

    if (this.startToday === true) {
      datepickerInstance?.setDate(new Date().toLocaleDateString('es-ES'));
    }

    if (this.startDate) {
      datepickerInstance?.setDate(this.startDate);
    }
  }
}
