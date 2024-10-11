import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Datepicker } from 'flowbite-datepicker';

@Component({
  selector: 'app-flowbite-datepicker',
  standalone: true,
  imports: [],
  templateUrl: './flowbite-datepicker.component.html',
  styleUrl: './flowbite-datepicker.component.scss',
})
export class FlowbiteDatepickerComponent {
  private datepicker: any | undefined;

  public id: string = Math.random().toString(36).substr(2, 6);
  @Input() title?: string = '';
  @Input() placeholder?: string = '';
  @Input() date?: string;
  @Input() startToday?: boolean;
  @Output() dateChange = new EventEmitter<string>();

  ngAfterViewInit(): void {
    const datepickerElement: HTMLElement | null = document.getElementById(
      `datepicker-${this.id}-actions`
    );

    if (datepickerElement) {
      // Configuración del datepicker
      this.loadConfig(datepickerElement);

      // Variables
      if (this.startToday) {
        this.datepicker?.setDate(new Date().toLocaleDateString('es-ES')); // dd/mm/yyyy
      }

      if (this.date) {
        this.datepicker?.setDate(this.date);
      }

      // Escuchar el evento changeDate para capturar la fecha seleccionada
      datepickerElement.addEventListener('changeDate', (event: any) => {
        const selectedDate = event.detail.date; // Accede a la fecha seleccionada
        this.dateChange.emit(selectedDate); // Emitir el evento al componente padre
      });
    }
  }

  private loadConfig(datepickerElement: HTMLElement): void {
    const options: any = {
      autohide: false,
      format: 'dd/mm/yyyy',
      language: 'es-ES', // Lenguaje seleccionado
      locale: { // Definición del locale 'es' para español
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        today: "Hoy",
        clear: "Borrar",
      },
      orientation: 'left',
      buttons: true, // Muestra u oculta los botones de control
      title: this.title, // Título del datepicker
      clearBtn: true, // Muestra u oculta el botón de limpiar
      todayBtn: true, // Muestra u oculta el botón de hoy
      todayBtnMode: 1, // 0: Focus, 1: Select
      weekStart: 1, // Lunes
      defaultViewDate: new Date().toLocaleDateString('es-ES'), // Fecha focuseada al abrir el datepicker
      // minDate: new Date().toLocaleDateString('es-ES'), // Fecha mínima
      // maxDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toLocaleDateString('es-ES'), // Fecha máxima
      datesDisabled: ["19/10/2024"], // Fechas deshabilitadas
    };

    this.datepicker = new Datepicker(datepickerElement, options);
  }

  onDateChange(event: any): void {
    const newDate = event.detail.date;
    this.dateChange.emit(newDate);
  }
}
