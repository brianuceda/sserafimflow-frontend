import { CurrencyEnum } from "./enums.model";

export interface Bank {
  id?: number;
  realName: string;
  ruc: number;
  imageUrl: string;
  username: string;
  password: string;
  mainCurrency: CurrencyEnum;
  previewDataCurrency: CurrencyEnum;
  creationDate: string;
  accountCreationDate: string;
  nominalRate: number;
  effectiveRate: number;
}