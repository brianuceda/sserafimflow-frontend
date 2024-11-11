import { FormControl } from "@angular/forms";
import { CurrencyEnum, DocumentTypeEnum } from "../../../../shared/data-access/models/enums.model";

export interface FieldsDocumentCreateModify {
  field: 'documentType' | 'amount' | 'currency' | 'dueDate' | 'clientName' | 'clientPhone';
}

export interface FormDocumentCreateModify {
  documentType: FormControl<DocumentTypeEnum | null>;
  amount: FormControl<number | null>;
  currency: FormControl<CurrencyEnum | null>;
  dueDate: FormControl<string | null>;
  clientName: FormControl<string | null>;
  clientPhone: FormControl<string | null>;
}
