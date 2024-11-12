import { Bank } from "./bank.model";
import { DocumentTypeEnum } from "./enums.model";
import { Portfolio } from "./portfolio.model";

export interface Document {
  id?: number;
  documentType: DocumentTypeEnum;
  amount: number;
  currency: string;
  issueDate: string;
  discountDate: string;
  expirationDate: string;
  state: string;
  clientName: string;
  clientPhone: string;

  bank?: Bank;
  portfolio?: Portfolio;
}