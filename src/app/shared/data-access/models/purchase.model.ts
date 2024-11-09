import { Bank } from "./bank.model";
import { Company } from "./company.model";

export interface PurchasedDocument {
  id: number;
  purchaseDate: string;
  payDate: string;
  currency: string;
  nominalValue: number;
  discountRate: number;
  receivedValue: number;
  days: number;
  tep: number;
  rateType: string;
  rateValue: number;
  state: string;

  bank: Bank;
  company: Company;

  document: Document;
}
