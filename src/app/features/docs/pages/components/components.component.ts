import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ComponentsConfigService } from '../../../../shared/data-access/services/components-config.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [],
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss',
})
export default class ComponentsComponent {
  // Datepicker
  @ViewChild('datepicker1', { static: true }) dp1!: ElementRef<HTMLInputElement>;
  @ViewChild('datepicker2', { static: true }) dp2!: ElementRef<HTMLInputElement>;
  @ViewChild('datepicker3', { static: true }) dp3!: ElementRef<HTMLInputElement>;
  @ViewChild('datepicker4', { static: true }) dp4!: ElementRef<HTMLInputElement>;

  // Datepicker
  private _componentsConfigService = inject(ComponentsConfigService);

  ngAfterViewInit() {
    // Datepicker
    this._componentsConfigService.initDatepicker(this.dp1.nativeElement);
    this._componentsConfigService.initDatepicker(this.dp2.nativeElement, null, true);
    this._componentsConfigService.initDatepicker(this.dp3.nativeElement, null, null, '01/01/2022');
    this._componentsConfigService.initDatepicker(this.dp4.nativeElement, { clearBtn: false });
  }

  // Buttons
  showSuccess(message: string) {
    toast.success(message);
  }

  showWarning(message: string) {
    toast.warning(message);
  }

  showInfo(message: string) {
    toast.info(message);
  }
  
  showError(message: string) {
    toast.error(message);
  }
}
