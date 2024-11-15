import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  NO_ERRORS_SCHEMA,
  Output,
  ViewChild,
} from '@angular/core';
import { toast } from 'ngx-sonner';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SafeHtmlPipe } from '../../data-access/pipes/safehtml.pipe';

export interface ActionsCol {
  edit: boolean;
  delete: boolean;
}

export interface EventEmitted {
  title: string;
  svg: string;
  emitEvents: string;
  pathToGo?: string;
}

export type ItemsPerPage = 5 | 10 | 15 | 30 | 50 | 100;

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, SafeHtmlPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  schemas: [NO_ERRORS_SCHEMA],
})
export class TableComponent {
  // ! IMPORTANTE: SI LA TABLA ES MODIFICABLE, SE DEBE TENER UN IDENTIFICADOR ÚNICO (id) PARA CADA FILA EN 'dataTable'
  // ! IMPORTANTE: LOS IDS DEBEN SER ÚNICAMENTE NÚMEROS, NO SE PERMITEN STRINGS

  @Input() eventsList: EventEmitted[] = [];

  // Filas por página
  public itemsPerPage: ItemsPerPage[] = [5, 10, 15, 30, 50, 100]; // ? OPCIONAL
  public isDivOpen: boolean = false; // NT
  // Paginación
  public pagesValues: number[] = [1]; // NT
  public currentPageValue: number = 1; // NT
  public totalPages: number = 1; // NT
  // Búsqueda
  @Input() searchInput: string = ''; // ? OPCIONAL
  @Input() lowerSelectedSearchTerm?: string; // NT

  log(str: string) {
    console.log(str);
  }

  // Tabla
  @Input() style: 'dark' | 'default' | 'light' = 'default'; // ? OPCIONAL
  @Input() titleText?: string; // ? OPCIONAL
  @Input() currentItemsPerPageValue: ItemsPerPage = 5; // ? OPCIONAL
  @Input() headersDisplayed!: string[]; // * OBLIGATORIO
  @Input() headersDisplayedNames!: string[]; // * OBLIGATORIO
  @Input() dataTable!: any[]; // * OBLIGATORIO

  @Input() haveConfig: boolean = true; // ? OPCIONAL
  @Input() haveSelectionCol: boolean = false; // ? OPCIONAL
  @Input() haveActionsCol: ActionsCol = { edit: false, delete: false }; // ? OPCIONAL [edit, delete]

  @Input() selectedColumns!: Set<number>; // ? OPCIONAL

  public showedData: any[] = []; // NT
  public isCtrlPressed: boolean = false; // NT

  public actualAction: boolean = false;

  @ViewChild('searchInputElement')
  searchInputElement!: ElementRef<HTMLInputElement>; // NT
  @ViewChild('tableElement') tableElement!: ElementRef<HTMLTableElement>; // NT
  @ViewChild('itemsPerPageMenuElement') itemsPerPageMenuElement!: ElementRef; // NT

  @Output() emitActions = new EventEmitter<any>(); //NT
  @Output() editRow = new EventEmitter<any>(); //NT
  @Output() deleteRow = new EventEmitter<any>(); //NT

  private _cdr = inject(ChangeDetectorRef); // NT
  private _router = inject(Router);

  ngOnInit() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));

    if (!this.selectedColumns) {
      this.selectedColumns = new Set();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }

  ngAfterViewInit() {
    if (this.headersDisplayed && this.headersDisplayedNames && this.dataTable) {
      this.resetTableConfig(true);
    }
  }

  // Cierra el menú de filas por página al hacer click fuera de él
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.headersDisplayed && this.headersDisplayedNames && this.dataTable) {
      if (
        this.isDivOpen &&
        !this.itemsPerPageMenuElement.nativeElement.contains(event.target)
      ) {
        this.isDivOpen = false;
      }
    }
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Control') {
      this.isCtrlPressed = true;
    }
  }

  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Control') {
      this.isCtrlPressed = false;
    }
  }

  // Actualiza los datos mostrados en la tabla al cambiar el término de búsqueda
  updateShowedData() {
    let index = this.headersDisplayed
      .map((header) => header.toLowerCase())
      .indexOf(this.lowerSelectedSearchTerm?.toLowerCase() ?? '');

    if (index === -1) {
      return;
    }

    const filteredData = this.dataTable.filter((item: any) => {
      if (this.lowerSelectedSearchTerm?.toLowerCase() === 'id') {
        const value = item.id?.toString().toLowerCase();
        return value?.includes(this.searchInput.toLowerCase());
      } else {
        const propertyKey = this.headersDisplayed[index];
        const value = item[propertyKey]?.toString().toLowerCase();
        return value?.includes(this.searchInput.toLowerCase());
      }
    });

    const startIndex =
      (this.currentPageValue - 1) * this.currentItemsPerPageValue;
    const endIndex = startIndex + this.currentItemsPerPageValue;

    this.totalPages = Math.ceil(
      filteredData.length / this.currentItemsPerPageValue
    );

    this.showedData = filteredData.slice(startIndex, endIndex);

    this.paginationValuesOnSearch(filteredData.length);

    this._cdr.detectChanges();
    this.updateCheckboxesForCurrentPage();
  }

  onOptionSelected(event: Event) {
    const target = event.target as HTMLSelectElement;

    if (target && target.value) {
      this.updateShowedData();
    }
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput = input.value.toLowerCase().trim();

    this.updateShowedData();
  }

  // Páginas visibles en la paginación (a partir de la página actual)
  getVisiblePages(): number[] {
    const totalVisible = 5;
    const totalPages = this.totalPages;
    const currentPage = this.currentPageValue;

    let pages: number[] = [];

    if (totalPages <= totalVisible) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
      pages = [1, 2, 3, 4, 5];
      pages.push(-1);
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push(-1);
      pages = pages.concat(
        Array.from({ length: 5 }, (_, i) => totalPages - 4 + i)
      );
    } else {
      pages.push(1);
      pages.push(-1);
      pages = pages.concat([currentPage - 1, currentPage, currentPage + 1]);
      pages.push(-1);
      pages.push(totalPages);
    }

    return pages;
  }

  // Cambia la página actual al hacer click en un número de la paginación
  changePage(page: number) {
    this.currentPageValue = page;

    this.updateShowedData();

    if (this.haveSelectionCol) {
      this.updateCheckboxesForCurrentPage();
    }

    this._cdr.detectChanges();
  }

  // Marca / desmarca las casillas basadas en los IDs seleccionados
  updateCheckboxesForCurrentPage() {
    const checkboxes =
      this.tableElement.nativeElement.querySelectorAll<HTMLInputElement>(
        '.row-checkbox-table'
      );

    checkboxes.forEach((checkbox) => {
      const itemId = parseInt(checkbox.value, 10);
      checkbox.checked = this.selectedColumns.has(itemId);
    });
  }

  // Actualiza los elementos mostrados en la tabla al cambiar de página
  updateFilteredItemsPerPage() {
    const totalItems = this.dataTable.length;

    let filtered = this.itemsPerPage.filter((item) => item <= totalItems);
    const closest = this.itemsPerPage.find((item) => item >= totalItems);

    if (closest && !filtered.includes(closest)) {
      filtered.push(closest);
    }

    this.itemsPerPage = filtered;
  }

  // Actualiza el número de páginas disponibles
  updatePaginationValues(newSize: number) {
    this.totalPages = Math.ceil(this.dataTable.length / newSize);
    this.pagesValues = Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  paginationValuesOnSearch(totalItems: number) {
    // Calcular el número total de páginas basadas en los datos filtrados
    this.totalPages = Math.ceil(totalItems / this.currentItemsPerPageValue);
    this.pagesValues = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Actualiza la cantidad de elementos mostrados en la tabla
  changeTableSize(newSize: ItemsPerPage) {
    this.currentItemsPerPageValue = newSize;
    this.currentPageValue = 1; // Restablece a la primera página al cambiar el tamaño

    this.updatePaginationValues(newSize); // Recalcula las páginas de la paginación
    this.updateShowedData(); // Actualiza los datos mostrados en la tabla

    this.isDivOpen = false; // Cierra el menú de elementos por página

    this._cdr.detectChanges();
  }

  // Selecciona o deselecciona todas las casillas de verificación de la tabla
  toggleAllCheckboxesVisiblesInHTML(event?: Event) {
    let isChecked =
      (event ? (event.target as HTMLInputElement).checked : false) ?? false;

    if (isChecked) {
      this.dataTable.forEach((item: any) => {
        this.selectedColumns.add(item.id);
      });
    } else {
      this.selectedColumns.clear();
    }

    const checkboxes =
      this.tableElement.nativeElement.querySelectorAll<HTMLInputElement>(
        '.row-checkbox-table'
      );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
  }

  // Elimina la selección de una fila al hacer ctrl + click en la fila
  toggleCheckboxOfRow(event: Event, item: any) {
    if (this.haveSelectionCol && this.isCtrlPressed) {
      event.stopPropagation();

      const checkbox = (event.currentTarget as HTMLElement).querySelector(
        '.row-checkbox-table'
      ) as HTMLInputElement;

      if (checkbox) {
        if (!this.selectedColumns.has(item.id)) {
          this.selectedColumns.add(item.id);
          checkbox.checked = true;
        } else {
          this.selectedColumns.delete(item.id);
          checkbox.checked = false;
        }
      }
    }
  }

  // Elimina la selección de una fila al presionar en el checkbox de la fila
  toggleCheckboxByInput(event: Event, item: any) {
    if (this.haveSelectionCol) {
      const checkbox = event.target as HTMLInputElement;

      if (checkbox.checked) {
        this.selectedColumns.add(item.id);
      } else {
        this.selectedColumns.delete(item.id);
      }
    }
  }

  executeAction(functionName: string, pathToGo?: string) {
    switch (functionName) {
      case 'resetTableConfig':
        this.resetTableConfig();
        break;
      case 'emitEvents':
        this.emitEvents(pathToGo);
        break;
      default:
        console.warn(`Function ${functionName} not found`);
    }
  }

  isObject(value: any) {
    return typeof value === 'object';
  }

  // Restablece la tabla a su estado original
  resetTableConfig(isInitLoad: boolean = false) {
    if (isInitLoad && this.searchInput && this.lowerSelectedSearchTerm) {
      this.searchInputElement.nativeElement.value = this.searchInput;
      this.lowerSelectedSearchTerm = this.lowerSelectedSearchTerm;
      this.updateShowedData();
    } else {
      if (!isInitLoad || !this.searchInput || !this.lowerSelectedSearchTerm) {
        this.searchInput = '';
        this.lowerSelectedSearchTerm = this.headersDisplayed[0];
        if (this.searchInputElement) {
          this.searchInputElement.nativeElement.value = '';
        }
      }
    }

    // Items por página
    this.currentItemsPerPageValue = this.itemsPerPage[0];
    this.updateFilteredItemsPerPage();

    // Tabla actualizada
    this.showedData = this.dataTable.slice(0, this.currentItemsPerPageValue);

    // Paginación
    this.currentPageValue = 1;
    this.updatePaginationValues(this.currentItemsPerPageValue);

    if (this.haveSelectionCol || isInitLoad && this.searchInput && this.lowerSelectedSearchTerm) {
      // Checkboxes marcados por defecto
      if (isInitLoad) {
        this.updateShowedData();
      }

      // Checkboxes a deseleccionados en vista
      if (!isInitLoad) {
        this.toggleAllCheckboxesVisiblesInHTML();
      }
    }

    this._cdr.detectChanges();
  }

  emitEvents(pathToGo?: string) {
    this.emitActions.emit(this.selectedColumns);
    if (pathToGo) {
      const selectedIds = Array.from(this.selectedColumns);
      this._router.navigate([pathToGo], {
        queryParams: { ids: selectedIds.join(',') },
      });
    } else {
      this.emitActions.emit(this.selectedColumns);
    }
  }

  emitEditRow(item: any) {
    this.editRow.emit(item.id);
  }

  emitDeleteRow(item: any) {
    this.deleteRow.emit(item.id);
  }

  showSuccess(item: any) {
    let firstAttr = item[Object.keys(item)[0]];

    toast.success('Usuario seleccionado: ' + firstAttr, {
      closeButton: true,
    });
  }

  getNestedContent(item: any, header: string): any {
    const value = item[header.toLowerCase()];
    if (typeof value === 'object' && value !== null) {
      return {
        name: value.name || null,
        url: value.url || null,
        imageurl: value.imageurl || null,
        text: value.text || null,
      };
    }
    // Si no es un objeto, devuelve el valor directamente
    return { text: value };
  }
}
