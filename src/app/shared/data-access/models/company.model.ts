import { CurrencyEnum } from "./enums.model";

export interface Company {
  realName: string;
  ruc: number;
  imageUrl: string;
  username: string;
  password?: string;
  mainCurrency: CurrencyEnum;
  previewDataCurrency: CurrencyEnum;
  creationDate: string;
  accountCreationDate: string;
  balance: number;
}