export interface Tep {
  tn: number;
  m: number;
  n: number;
  value: number | string;
}

export interface DiscountedRate {
  tep: number;
  value: number | string;
}

export interface ReceivedValue {
  nominalValue: number;
  d: number;
  value: number;
}

export interface PurchaseEquations {
  tep: Tep;
  discountedRate: DiscountedRate;
  receivedValue: ReceivedValue;
}