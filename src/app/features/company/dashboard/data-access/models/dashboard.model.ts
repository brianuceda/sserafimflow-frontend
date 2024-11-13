import { CurrencyEnum } from "../../../../../shared/data-access/models/enums.model";
import { ExchangeRate } from "../../../../../shared/data-access/models/exchange-rate.mode";

export interface Dashboard {
  totalNominalValueIssued: number | string;
  totalNominalValueReceived: number | string;
  totalNominalValueDiscounted: number | string;
  mostUsedBankForSales: string;
  mostUsedPeriodRate?: 'NOMINAL' | 'EFFECTIVE';
  mostUsedCurrency?: CurrencyEnum;
  cantSoldInvoicesPerMonth: number[];
  cantSoldLettersPerMonth: number[];
  amountSoldInvoicesPerMonth: number[];
  amountSoldLettersPerMonth: number[];
  
  mainCurrency?: CurrencyEnum;
  todayExchangeRate?: ExchangeRate;
}