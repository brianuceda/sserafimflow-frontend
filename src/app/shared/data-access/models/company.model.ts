import { CurrencyEnum } from "./enums.model";

export interface Company {
  realName: string;
  ruc: number;
  imageUrl: string;
  username: string;
  password?: string;
  mainCurrency: CurrencyEnum;
  previewDataCurrency: CurrencyEnum;
  balance: number | string;
  creationDate: string;
  accountCreationDate: string;
}