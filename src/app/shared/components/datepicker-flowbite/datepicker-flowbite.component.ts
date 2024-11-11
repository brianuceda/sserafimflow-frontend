import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Datepicker } from 'flowbite-datepicker';
import { CommonModule } from '@angular/common';

export interface DatepickerOptions {
  autohide?: boolean;
  beforeShowDay?: (date: Date) => boolean;
  beforeShowDecade?: (date: Date) => boolean;
  beforeShowMonth?: (date: Date) => boolean;
  beforeShowYear?: (date: Date) => boolean;
  buttons?: boolean;
  calendarWeeks?: boolean;
  clearBtn?: boolean;
  dateDelimiter?: string;
  datesDisabled?: string[];
  daysOfWeekDisabled?: number[];
  daysOfWeekHighlighted?: number[];
  defaultViewDate?: string;
  disableTouchKeyboard?: boolean;
  format?: string;
  language?: string;
  maxDate?: string;
  maxNumberOfDates?: number;
  maxView?: number;
  minDate?: string;
  nextArrow?: string;
  orientation?: string;
  pickLevel?: number;
  prevArrow?: string;
  showDaysOfWeek?: boolean;
  showOnClick?: boolean;
  showOnFocus?: boolean;
  startView?: number;
  title?: string;
  todayBtn?: boolean;
  todayBtnMode?: number;
  todayHighlight?: boolean;
  updateOnBlur?: boolean;
  weekStart?: number;
}

@Component({
  selector: 'app-datepicker-flowbite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './datepicker-flowbite.component.html',
  styleUrl: './datepicker-flowbite.component.scss',
})
export class DatepickerFlowbiteComponent {
  @Input() label?: string; // ? OPCIONAL
  @Input() customStyle: 'dark' | 'default' = 'default'; // ? OPCIONAL

  @Input() startToday?: boolean = false;
  @Input() startDate?: string;
  @Input() config?: DatepickerOptions;
  @Input() disabled: boolean = false;

  @Output() dateChanged = new EventEmitter<string>();

  @ViewChild('datepicker', { static: true })
  datepicker!: ElementRef<HTMLInputElement>;
  datepickerInstance!: Datepicker;

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

    let modifiedOptions = { ...defaultConfig, ...this.config };

    this.datepickerInstance = new Datepicker(
      this.datepicker.nativeElement,
      modifiedOptions
    );

    this.datepicker.nativeElement.addEventListener(
      'changeDate',
      (event: any) => {
        this.dateChanged.emit(event.target.value);
      }
    );

    if (this.startToday === true) {
      this.datepickerInstance?.setDate(new Date().toLocaleDateString('es-ES'));
    }

    if (this.startDate) {
      this.datepickerInstance?.setDate(this.startDate);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['startDate'] &&
      changes['startDate'].currentValue &&
      this.datepickerInstance
    ) {
      this.datepickerInstance.setDate(changes['startDate'].currentValue);
    }
  }
}
