import { FormControl } from '@angular/forms';

export interface ModelCompanyRegister {
  realName: string;
  ruc: number;
  username: string;
  password: string;
  image: any;
}

export interface FieldsCompanyRegister {
  field: 'realName' | 'ruc' | 'username' | 'password' | 'image';
}

export interface FormCompanyRegister {
  realName: FormControl<string | null>;
  ruc: FormControl<number | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  image: FormControl<any | null>;
}
