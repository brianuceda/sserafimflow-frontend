import { Component, inject } from '@angular/core';
import { FieldsBankRegister, FormBankRegister } from '../../../data-access/models/bank-auth.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';
import { hasAnyError, isValidPassword } from '../../../../shared/utils/form-validators';
import { AuthService } from '../../../data-access/services/auth.service';
import { CommonModule } from '@angular/common';
import { CurrencyEnum } from '../../../../shared/data-access/models/enums.model';
import { Bank } from '../../../../shared/data-access/models/bank.model';
import { DatepickerFlowbiteComponent } from '../../../../shared/components/datepicker-flowbite/datepicker-flowbite.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule, ReactiveFormsModule, DatepickerFlowbiteComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export default class RegisterComponent {
  public imagePreview: string | null = null;
  public imageUploaded: any;
  public rememberMe = false;
  
  public form!: FormGroup<FormBankRegister>;

  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  constructor() {
    // Datepicker oscuro
    document.body.classList.add('dark-dp');
    
    this.form = this._formBuilder.group<FormBankRegister>({
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
      password: this._formBuilder.control('', [
        Validators.required,
        Validators.maxLength(50),
        isValidPassword(),
      ]),
      mainCurrency: this._formBuilder.control(CurrencyEnum.PEN, [
        Validators.required,
        Validators.pattern(/^(PEN|USD|CAD|EUR)$/)
      ]),
      creationDate: this._formBuilder.control('', [
        Validators.required,
      ]),
      nominalRate: this._formBuilder.control(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]),
      effectiveRate: this._formBuilder.control(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]),
    });
  }

  isRequired(input: FieldsBankRegister) {
    return hasAnyError(input, this.form, 'required');
  }

  hasEmailError(input: FieldsBankRegister) {
    return hasAnyError(input, this.form, 'email');
  }

  hasMinLengthError(input: FieldsBankRegister) {
    return hasAnyError(input, this.form, 'minlength');
  }

  hasMaxLengthError(input: FieldsBankRegister) {
    return hasAnyError(input, this.form, 'maxlength');
  }

  hasMinError(input: FieldsBankRegister) {
    return hasAnyError(input, this.form, 'min');
  }

  hasMaxError(input: FieldsBankRegister) {
    return hasAnyError(input, this.form, 'max');
  }
  
  onDateChange(date: string) {
    date = date.split('/').reverse().join('-');
    this.form.controls['creationDate'].setValue(date);
  }

  async bankRegister() {
    if (this.form.invalid) return;
    const { realName, ruc, username, password, mainCurrency, nominalRate, effectiveRate, creationDate } = this.form.value;
    if (!realName || !ruc || !username || !password || !mainCurrency || !nominalRate || !effectiveRate || !creationDate) return;

    const user: Partial<Bank> = {
      realName,
      ruc,
      username,
      password,
      mainCurrency: mainCurrency as CurrencyEnum,
      nominalRate,
      effectiveRate,
      creationDate,
    };

    this._authService.bankRegister(user, this.imageUploaded, this.rememberMe).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this._router.navigateByUrl('/app/banco/dashboard');
          setTimeout(() => {
            toast.success('Bienvenido por primera vez!');
          }, 100);
        } else {
          const errorMessage = response?.message || 'Ocurrió un error interno';
          toast.error(errorMessage);
        }
      },
      error: (error: any) => {
        console.log(error);

        const errorMessage = error?.error?.message || 'Ocurrió un error interno';
        toast.error(errorMessage);
      }
    });
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
  
  // Image
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageUploaded = file;

      const imageElement = document.getElementById('image');
      if (imageElement) {
        // eliminar la clase !text-neutral-500
        imageElement.classList.remove('!text-neutral-500');
        imageElement.classList.add('!text-neutral-200');
      }

      // Si el archivo es una imagen, genera la vista previa
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.imagePreview = null;
      }
    }
  }
}
