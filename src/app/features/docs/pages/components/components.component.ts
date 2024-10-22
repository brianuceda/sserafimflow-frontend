import { DatepickerFlowbiteComponent } from './../../../../shared/components/datepicker-flowbite/datepicker-flowbite.component';
import { Component, OnInit } from '@angular/core';
import { toast } from 'ngx-sonner';
import { TableComponent } from '../../../../shared/components/table/table.component';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [DatepickerFlowbiteComponent, TableComponent],
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss',
})
export default class ComponentsComponent implements OnInit {
  // Table
  public headersDisplayedNames: string[] = [];
  public headersDisplayed: string[] = [];
  public selectedColumns: Set<number> = new Set();
  public dataTable: any[] = [];

  ngOnInit() {
    // Table
    this.generateTestData();
  }

  // Input Number
  enforceMinMax(event: KeyboardEvent) {
    const el = event.target as HTMLInputElement;
    const min = parseInt(el.min) || -Infinity;
    const max = parseInt(el.max) || Infinity;

    if (el.value != "") {
      if (parseInt(el.value) < min) {
        el.value = min.toString();
      }
      if (parseInt(el.value) > max) {
        el.value = max.toString();
      }
    }
  }

  // Buttons
  showSuccess(message: string) {
    toast.success(message, {
      closeButton: true,
    });
  }

  showWarning(message: string) {
    toast.warning(message, {
      closeButton: true,
    });
  }

  showInfo(message: string) {
    toast.info(message, {
      closeButton: true,
    });
  }

  showError(message: string) {
    toast.error(message, {
      closeButton: true,
    });
  }

  // Table
  generateTestData() {
    // Datos obligatorios de la tabla
    this.headersDisplayed = ['name', 'age', 'email', 'address', 'note', 'alive'];
    this.headersDisplayedNames = ['Nombre', 'Edad', 'Correo electrónico', 'Dirección', 'Nota', 'Vive'];
    this.selectedColumns = new Set([1, 2, 4]); 

    // Datos de prueba
    const firstNames = ['Carlos', 'Ana', 'Juan', 'María', 'Luis', 'Sofía', 'Pedro', 'Lucía', 'Miguel', 'Camila'];
    const lastNames = ['González', 'Rodríguez', 'Martínez', 'López', 'Pérez', 'García', 'Sánchez', 'Ramírez', 'Torres', 'Flores'];
    const cities = ['Ciudad 1', 'Ciudad 2', 'Ciudad 3', 'Ciudad 4', 'Ciudad 5', 'Ciudad 6', 'Ciudad 7', 'Ciudad 8', 'Ciudad 9', 'Ciudad 10'];
    const countries = ['México', 'Argentina', 'España', 'Colombia', 'Chile', 'Perú', 'Uruguay', 'Ecuador', 'Venezuela', 'Bolivia'];
    for (let i = 0; i < 30; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@gmail.com`;
      const address = `${Math.floor(Math.random() * 1000) + 1} ${lastName} St, ${cities[Math.floor(Math.random() * cities.length)]}, ${countries[Math.floor(Math.random() * countries.length)]}`;
      
      this.dataTable.push({
        id: i + 1,
        name: `${firstName} ${lastName}`,
        age: Math.floor(Math.random() * 50) + 18,
        email: email,
        address: address,
        note: `${Math.floor(Math.random() * 20) + 1}`,
        alive: Math.random() >= 0.5 ? 'Sí' : 'No',
      });
    }
  }

  emitActionsMethod(event: any) {
    console.log(event);
  }

  emitEditRow(item: any) {
    console.log('Edit');
    console.log(item);
  }

  emitDeleteRow(item: any) {
    console.log('Delete');
    console.log(item);

    // eliminar todo
    this.dataTable = [];
  }
}
