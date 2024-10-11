import { FormControl } from '@angular/forms';

export interface ModelCompanySignUp {
  email: string;
  password: string;
  role: 'COMPANY' | 'ADMIN';
  companyName: string;
  ruc: number;
}

export interface FieldsCompanySignUp {
  field: 'email' | 'password' | 'role' | 'companyName' | 'ruc';
}

export interface FormCompanySignUp {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  role: FormControl<'COMPANY' | 'ADMIN' | null>;
  companyName: FormControl<string | null>;
  ruc: FormControl<number | null>;
}
