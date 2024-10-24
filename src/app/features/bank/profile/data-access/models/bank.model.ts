export interface Bank {
  id?: number;
  realName: string;
  ruc: string;
  username: string;
  imageUrl: string;
  currency: string;
  balance: number;
  nominalRate: number;
  effectiveRate: number;
  creationDate: string;
}
