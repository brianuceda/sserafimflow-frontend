import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  isRequired,
  hasEmailError,
} from '../../../shared/utils/form-validators';
import { AuthService } from '../../data-access/services/auth.service';
import {
  FieldsCompanySignIn,
  FormCompanySignIn,
} from '../../data-access/models/company-sign-in.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form = this._formBuilder.group<FormCompanySignIn>({
    email: this._formBuilder.control('', [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control('', [Validators.required]),
    role: this._formBuilder.control('COMPANY', [Validators.required]),
  });

  isRequired(input: FieldsCompanySignIn) {
    return isRequired(input, this.form);
  }

  hasEmailError() {
    return hasEmailError(this.form);
  }
}
