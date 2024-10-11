import { Component } from '@angular/core';
import { FlowbiteDatepickerComponent } from '../../../../shared/components/flowbite-datepicker/flowbite-datepicker.component';

@Component({
  selector: 'app-listar-bancos',
  standalone: true,
  imports: [FlowbiteDatepickerComponent],
  templateUrl: './listar-bancos.component.html',
  styleUrl: './listar-bancos.component.scss',
})
export default class ListarBancosComponent {
  selectedDate: string = '01/01/2023';

  onDateSelected(newDate: string) {
    this.selectedDate = new Date(newDate).toLocaleDateString('es-ES');
    console.log('Fecha seleccionada:', this.selectedDate);
  }
}
