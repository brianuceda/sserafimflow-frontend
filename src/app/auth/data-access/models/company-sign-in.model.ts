import { FormControl } from '@angular/forms';

export interface ModelCompanySignIn {
  email: string;
  password: string;
}

export interface FieldsCompanySignIn {
  field: 'email' | 'password' | 'role';
}

export interface FormCompanySignIn {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
