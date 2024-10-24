import { FormControl } from '@angular/forms';

export interface ModelBankRegister {
  realName: string;
  ruc: number;
  username: string;
  password: string;
  currency: 'PEN' | 'USD' | 'CAD' | 'EUR';
  nominalRate: number;
  effectiveRate: number;
  // extraCommission: number;
}

export interface FieldsBankRegister {
  field: 'realName' | 'ruc' | 'username' | 'password' | 'currency' | 'nominalRate' | 'effectiveRate'; // | 'extraCommission';
}

export interface FormBankRegister {
  realName: FormControl<string | null>;
  ruc: FormControl<number | null>;
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  currency: FormControl<'PEN' | 'USD' | 'CAD' | 'EUR' | null>;
  nominalRate: FormControl<number | null>;
  effectiveRate: FormControl<number | null>;
  // extraCommission: FormControl<number | null>;
}
