import { Injectable } from '@angular/core';
import { Datepicker } from 'flowbite-datepicker';
import { DatepickerOptions } from '../models/datepicker-options.model';

@Injectable({
  providedIn: 'root',
})
export class ComponentsConfigService {
  initDatepicker(
    element: HTMLElement,
    config?: DatepickerOptions | null,
    startToday?: boolean | null,
    date?: string | null
  ): Datepicker {
    // Configuración por defecto
    let options: DatepickerOptions = {
      autohide: true,
      format: 'dd/mm/yyyy',
      orientation: 'left',
      clearBtn: true,
      todayBtn: true,
      todayBtnMode: 1,
      weekStart: 1,
      defaultViewDate: new Date().toLocaleDateString('es-ES'),
    };

    if (config) {
      options = { ...options, ...config };
    }

    // Inicializa el datepicker
    let datepicker = new Datepicker(element, options);

    // Fecha de hoy
    if (startToday && startToday === true) {
      datepicker?.setDate(new Date().toLocaleDateString('es-ES'));
    }

    // Fecha seleccionada
    if (date) {
      datepicker?.setDate(date);
    }

    return datepicker;
  }
}
