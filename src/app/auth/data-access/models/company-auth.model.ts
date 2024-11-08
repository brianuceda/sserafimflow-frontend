import { FormControl } from '@angular/forms';
import { CurrencyEnum } from '../../../shared/data-access/models/enums.model';

export interface FieldsCompanyRegister {
  field: 'realName' | 'ruc' | 'username' | 'password' | 'mainCurrency' | 'creationDate';
}

export interface FieldsCompanyLogin {
  field: 'username' | 'password';
}

export interface FormCompanyRegister {
  realName: FormControl<string | null>;
  ruc: FormControl<number | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  creationDate: FormControl<string | null>;
  accountCreationDate: FormControl<string | null>;
  mainCurrency: FormControl<CurrencyEnum | null>;
  previewDataCurrency: FormControl<CurrencyEnum | null>;
}

export interface FormCompanyLogin {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}
