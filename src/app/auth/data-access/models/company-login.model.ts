import { FormControl } from '@angular/forms';

export interface ModelCompanyLogin {
  username: string;
  password: string;
}

export interface FieldsCompanyLogin {
  field: 'username' | 'password';
}

export interface FormCompanyLogin {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}
