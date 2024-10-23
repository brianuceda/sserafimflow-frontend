import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { isRequired, hasEmailError } from '../../../../shared/utils/form-validators';
import { FormCompanyLogin, FieldsCompanyLogin, ModelCompanyLogin } from '../../../data-access/models/company-login.model';
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

  form = this._formBuilder.group<FormCompanyLogin>({
    username: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', [Validators.required]),
  });

  isRequired(input: FieldsCompanyLogin) {
    return isRequired(input, this.form);
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }


  async companyLogin() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    if (!username || !password) return;

    const user: ModelCompanyLogin = {
      username,
      password,
    };

    this._authService.companyLogin(user).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this._router.navigateByUrl('/app/empresa/dashboard');
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
