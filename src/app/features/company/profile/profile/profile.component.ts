import { Component, inject } from '@angular/core';
import { CompanyService } from '../data-access/services/company.service';
import { CommonModule } from '@angular/common';
import { Company } from '../../../../shared/data-access/models/company.model';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { CurrencyEnum } from '../../../../shared/data-access/models/enums.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FieldsCompanyRegister, FormCompanyRegister } from '../../../../auth/data-access/models/company-auth.model';
import { hasAnyError } from '../../../../shared/utils/form-validators';
import { DatepickerFlowbiteComponent } from '../../../../shared/components/datepicker-flowbite/datepicker-flowbite.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LoaderComponent, ReactiveFormsModule, DatepickerFlowbiteComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export default class ProfileComponent {
  public isLoading: true | false | null = true;

  public companyProfile: Partial<Company> = {};
  public tempSaveInitialCompanyProfile: Partial<Company> = {};

  public form!: FormGroup<Partial<FormCompanyRegister>>;

  private _formBuilder = inject(FormBuilder);
  private _companyService = inject(CompanyService);

  constructor() {
    this.form = this._formBuilder.group<Partial<FormCompanyRegister>>({
      realName: this._formBuilder.control('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      ruc: this._formBuilder.control(null, [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      username: this._formBuilder.control('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]),
      creationDate: this._formBuilder.control('', [
        Validators.required,
      ]),
      mainCurrency: this._formBuilder.control(CurrencyEnum.PEN, [
        Validators.required,
        Validators.pattern(/^(PEN|USD|CAD|EUR)$/)
      ]),
      previewDataCurrency: this._formBuilder.control(CurrencyEnum.PEN, [
        Validators.required,
        Validators.pattern(/^(PEN|USD|CAD|EUR)$/)
      ]),
    });
  }

  ngOnInit(): void {
    this._companyService.getCompanyProfile().subscribe({
      next: (data: Company) => {
        this.companyProfile = { ...data };

        console.log('datos llegando...');
        console.log(data);
        
        // Variable temporal para guardar lo que llega del backend
        this.tempSaveInitialCompanyProfile = {
          realName: data.realName,
          ruc: data.ruc,
          username: data.username,
          creationDate: data.creationDate,
          mainCurrency: data.mainCurrency,
          previewDataCurrency: data.previewDataCurrency,
        }

        // Modificar valores
        this.companyProfile.balance = this.formatNumber(data.balance, data.mainCurrency);
        this.companyProfile.creationDate = data.creationDate.split('-').reverse().join('/')
        this.companyProfile.accountCreationDate = this.formatTimestamp(data.accountCreationDate);

        // Asignar valores al formulario
        this.form.patchValue({
          realName: this.companyProfile.realName,
          ruc: this.companyProfile.ruc,
          username: this.companyProfile.username,
          creationDate: this.companyProfile.creationDate,
          mainCurrency: this.companyProfile.mainCurrency,
          previewDataCurrency: this.companyProfile.previewDataCurrency,
        });

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = null;
        console.error(error);
      }
    });
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const formattedDate = `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}/${date.getUTCFullYear()} - ${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;
    return formattedDate;
  }

  // Ruc
  enforceRucPattern(event: Event) {
    const el = event.target as HTMLInputElement;
    const value = el.value.replace(/[^0-9]/g, '').slice(0, 11);

    el.value = value;

    if (value) {
      this.form.get('ruc')?.setValue(Number(value), { emitEvent: false });
    } else {
      this.form.get('ruc')?.setValue(null, { emitEvent: false });
    }
  }

  isRequired(input: FieldsCompanyRegister) {
    return hasAnyError(input, this.form, 'required');
  }

  hasEmailError(input: FieldsCompanyRegister) {
    return hasAnyError(input, this.form, 'email');
  }

  hasMinLengthError(input: FieldsCompanyRegister) {
    return hasAnyError(input, this.form, 'minlength');
  }

  hasMaxLengthError(input: FieldsCompanyRegister) {
    return hasAnyError(input, this.form, 'maxlength');
  }

  onDateChange(date: string) {
    date = date.split('/').reverse().join('-');
    if (this.form.controls['creationDate']) {
      this.form.controls['creationDate'].setValue(date);
    }
  }

  private formatNumber(value: string | number, targetCurrency: CurrencyEnum) {
    return parseFloat(value.toString()).toLocaleString('es-PE', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 3,
    });
  }

  updateProfile() {
    if (this.form.invalid) return;
    const { realName, ruc, username, creationDate, mainCurrency, previewDataCurrency } = this.form.value;
    if (!realName || !ruc || !username || !creationDate || !mainCurrency || !previewDataCurrency) return;

    const user: Partial<Company> = {
      realName,
      ruc,
      username,
      creationDate,
      mainCurrency: mainCurrency as CurrencyEnum,
      previewDataCurrency: previewDataCurrency as CurrencyEnum,
    };

    if (JSON.stringify(user) === JSON.stringify(this.tempSaveInitialCompanyProfile)) {
      toast.info('No se realizaron cambios');
      return;
    }

    console.log('enviando datos...');
    console.log(user);

    this._companyService.updateCompanyProfile(user).subscribe({
      next: (response: any) => {
        toast.success(response.message);
        this.tempSaveInitialCompanyProfile = { ...user };
      },
      error: (error: any) => {
        console.log(error);

        const errorMessage = error?.error?.message || 'Ocurrió un error interno';
        toast.error(errorMessage);
      }
    });
  }

  resetChanges() {
    this.form.reset({
      realName: this.tempSaveInitialCompanyProfile.realName,
      ruc: this.tempSaveInitialCompanyProfile.ruc,
      username: this.tempSaveInitialCompanyProfile.username,
      creationDate: this.tempSaveInitialCompanyProfile.creationDate,
      mainCurrency: this.tempSaveInitialCompanyProfile.mainCurrency,
      previewDataCurrency: this.tempSaveInitialCompanyProfile.previewDataCurrency,
    });

    toast.info('Cambios descartados');

    console.log('datos reseteados...');
    console.log(this.form.value);
  }
}
