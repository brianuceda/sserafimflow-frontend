import { FormControl } from '@angular/forms';
import { CurrencyEnum } from '../../../shared/data-access/models/enums.model';

export interface FieldsBankRegister {
  field: 'realName' | 'ruc' | 'username' | 'password' | 'mainCurrency' | 'nominalRate' | 'effectiveRate';
}

export interface FieldsBankLogin {
  field: 'username' | 'password';
}

export interface FormBankRegister {
  realName: FormControl<string | null>;
  ruc: FormControl<number | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  mainCurrency: FormControl<CurrencyEnum | null>;
  nominalRate: FormControl<number | null>;
  effectiveRate: FormControl<number | null>;
}

export interface FormBankLogin {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
}
