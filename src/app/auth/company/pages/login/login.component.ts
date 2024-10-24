import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { hasAnyError, isValidPassword } from '../../../../shared/utils/form-validators';
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
  public rememberMe = false;

  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form = this._formBuilder.group<FormCompanyLogin>({
    username: this._formBuilder.control('', [
      Validators.required,
      Validators.maxLength(150),
      Validators.email,
    ]),
    password: this._formBuilder.control('', [
      Validators.required,
      Validators.maxLength(150),
      isValidPassword(),
    ]),
  });

  isRequired(input: FieldsCompanyLogin) {
    return hasAnyError(input, this.form, 'required');
  }

  hasEmailError(input: FieldsCompanyLogin) {
    return hasAnyError(input, this.form, 'email');
  }

  hasMaxLengthError(input: FieldsCompanyLogin) {
    return hasAnyError(input, this.form, 'maxlength');
  }

  async companyLogin() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    if (!username || !password) return;

    const user: ModelCompanyLogin = {
      username,
      password,
    };

    this._authService.companyLogin(user, this.rememberMe).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this._router.navigateByUrl('/app/empresa/dashboard');
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

    //   const loginObservable = lastValueFrom(this._authService.companyLogin(user, this.rememberMe));

    //   toast.promise(
    //     loginObservable.then(() => {
    //       return new Promise<void>((resolve) => {
    //         loginObservable.then((response: any) => {
    //           if (response.token) {
    //             localStorage.setItem('token', response.token);
    //             this._router.navigateByUrl('/app/empresa/dashboard');
    //             resolve();
    //           } else {
    //             console.log('Error al iniciar sesión: ' + response?.message || 'Ocurrió un error interno');
    //             resolve(Promise.reject());
    //           }
    //         });
    //       });
    //     }),
    //     {
    //       loading: 'Iniciando sesión...',
    //       success: 'Sesión iniciada correctamente',
    //       error: 'Ocurrió un error interno',
    //     }
    //   );
    // }
  }
}
