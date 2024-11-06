import { CurrencyEnum } from "./backend.enum";

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