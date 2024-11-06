import { ExchangeRate } from "../../../../../shared/data-access/models/exchange-rate.mode";

export interface Dashboard {
  totalNominalValueIssued: string;
  totalNominalValueReceived: string;
  totalNominalValueDiscounted: string;
  pendingPortfoliosToPay: number;
  mostUsedPeriodRate?: 'NOMINAL' | 'EFFECTIVE';
  mostUsedCurrency?: 'PEN' | 'USD';
  cantSoldLettersPerMonth: number[];
  cantSoldInvoicesPerMonth: number[];
  amountSoldLettersPerMonth: number[];
  amountSoldInvoicesPerMonth: number[];
  exchangeRate: ExchangeRate;
}