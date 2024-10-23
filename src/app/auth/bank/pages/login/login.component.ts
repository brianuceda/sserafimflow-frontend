import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';
import { isRequired, hasEmailError } from '../../../../shared/utils/form-validators';
import { FormBankLogin, FieldsBankLogin, ModelBankLogin } from '../../../data-access/models/bank-login.model';
import { AuthService } from '../../../data-access/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form = this._formBuilder.group<FormBankLogin>({
    username: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', [Validators.required]),
  });

  isRequired(input: FieldsBankLogin) {
    return isRequired(input, this.form);
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }


  async bankLogin() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    if (!username || !password) return;

    const user: ModelBankLogin = {
      username,
      password,
    };

    this._authService.bankLogin(user).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this._router.navigateByUrl('/app/dashboard');
          setTimeout(() => {
            toast.success('Bienvenido nuevamente!');
          }, 100);
        } else {
          const errorMessage = response?.message || 'Ocurrió un error internamente';
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
