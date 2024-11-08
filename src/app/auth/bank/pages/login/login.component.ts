import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import { hasAnyError, isValidPassword } from '../../../../shared/utils/form-validators';
import { AuthService } from '../../../data-access/services/auth.service';
import { FormBankLogin, FieldsBankLogin } from '../../../data-access/models/bank-auth.model';
import { Bank } from '../../../../shared/data-access/models/bank.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  public rememberMe = false;

  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form = this._formBuilder.group<FormBankLogin>({
    username: this._formBuilder.control('', [
      Validators.required,
      Validators.maxLength(150),
      Validators.email,
    ]),
    password: this._formBuilder.control('', [
      Validators.required,
      Validators.maxLength(50),
      isValidPassword(),
    ]),
  });

  isRequired(input: FieldsBankLogin) {
    return hasAnyError(input, this.form, 'required');
  }

  hasEmailError(input: FieldsBankLogin) {
    return hasAnyError(input, this.form, 'email');
  }

  hasMaxLengthError(input: FieldsBankLogin) {
    return hasAnyError(input, this.form, 'maxlength');
  }

  async bankLogin() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    if (!username || !password) return;

    const user: Partial<Bank> = {
      username,
      password,
    };

    this._authService.bankLogin(user, this.rememberMe).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this._router.navigateByUrl('/app/banco/dashboard');

          setTimeout(() => {
            toast.success('Bienvenido nuevamente!');
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
}
