import { CurrencyEnum } from "./enums.model";

export interface Bank {
  realName: string;
  ruc: number;
  imageUrl: string;
  username: string;
  password: string;
  mainCurrency: CurrencyEnum;
  previewDataCurrency: CurrencyEnum;
  nominalRate: number;
  effectiveRate: number;
}