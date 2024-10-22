import { FormControl } from '@angular/forms';

export interface ModelBankLogin {
  username: string;
  password: string;
}

export interface FieldsBankLogin {
  field: 'username' | 'password';
}

export interface FormBankLogin {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}
