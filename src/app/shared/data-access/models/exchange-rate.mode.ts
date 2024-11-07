import { CurrencyEnum } from "./enums.model";

export interface CurrencyRate {
  currencyName: string;
  currency: string | CurrencyEnum;
  purchasePrice: number;
  salePrice: number;
}

export interface ExchangeRate {
  date: string | Date;
  currencyRates: CurrencyRate[];
}