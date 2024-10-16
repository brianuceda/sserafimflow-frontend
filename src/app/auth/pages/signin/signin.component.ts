import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  isRequired,
  hasEmailError,
} from '../../../shared/utils/form-validators';
import { AuthService } from '../../data-access/services/auth.service';
import {
  FieldsCompanySignIn,
  FormCompanySignIn,
  ModelCompanySignIn,
} from '../../data-access/models/company-sign-in.model';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';
import { AuthResponse } from '../../data-access/models/auth-response.model';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export default class SigninComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form = this._formBuilder.group<FormCompanySignIn>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', [Validators.required]),
  });

  isRequired(input: FieldsCompanySignIn) {
    return isRequired(input, this.form);
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }

  
  async signIn() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    if (!email || !password) return;
  
    const user: ModelCompanySignIn = {
      email,
      password,
    };
  
    try {
      this._authService.signin(user).subscribe({
        next: (response: AuthResponse) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this._router.navigateByUrl('/app/dashboard');
            setTimeout(() => {
              toast.success('Hola nuevamente!');
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
    } catch (error: any) {
      const errorMessage = error?.message || 'Ocurrió un error inesperado';
      toast.error(errorMessage);
    }
  }
  
}
