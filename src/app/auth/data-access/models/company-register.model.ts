import { FormControl } from '@angular/forms';

export interface ModelCompanyRegister {
  realName: string;
  ruc: number;
  username: string;
  password: string;
}

export interface FieldsCompanyRegister {
  field: 'realName' | 'ruc' | 'username' | 'password';
}

export interface FormCompanyRegister {
  realName: FormControl<string | null>;
  ruc: FormControl<number | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}
