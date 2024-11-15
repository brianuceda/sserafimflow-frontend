import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { DocumentsService } from '../../data-access/services/documents.service';
import { Router } from '@angular/router';
import { Document as SharedDocument } from '../../../../../shared/data-access/models/document.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CurrencyEnum,
  DocumentTypeEnum,
} from '../../../../../shared/data-access/models/enums.model';
import {
  DatepickerFlowbiteComponent,
  DatepickerOptions,
} from '../../../../../shared/components/datepicker-flowbite/datepicker-flowbite.component';
import { toast } from 'ngx-sonner';
import { hasAnyError } from '../../../../../shared/utils/form-validators';

interface FieldsDocumentCreateModify {
  field: 'documentType' | 'amount' | 'currency' | 'discountDate' | 'expirationDate' | 'clientName' | 'clientPhone';
}

interface FormDocumentCreateModify {
  documentType: FormControl<DocumentTypeEnum | null>;
  amount: FormControl<number | null>;
  currency: FormControl<CurrencyEnum | null>;
  discountDate: FormControl<string | null>;
  expirationDate: FormControl<string | null>;
  clientName: FormControl<string | null>;
  clientPhone: FormControl<string | null>;
}

@Component({
  selector: 'app-create-modify-document',
  standalone: true,
  imports: [
    LoaderComponent,
    ReactiveFormsModule,
    FormsModule,
    DatepickerFlowbiteComponent,
  ],
  templateUrl: './create-modify-document.component.html',
  styleUrl: './create-modify-document.component.scss',
})
export default class CreateModifyDocumentComponent {
  actionTitle = 'Crear documento';
  public datePickerConfig: DatepickerOptions = {
    clearBtn: false,
    minDate: new Date().toLocaleDateString('es-ES'),
  };
  id?: number;

  public isLoading: true | false | null = false;
  public isEditing: boolean = false;

  public document!: Partial<SharedDocument>;
  public form!: FormGroup;

  private _documentsService = inject(DocumentsService);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);
  private _cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.getDocumentIfEdit();
    this.initForm();
  }

  getDocumentIfEdit() {
    const id = this._router.url.split('/').pop();
    if (id && id !== 'crear-modificar') {
      this.isEditing = true;
      this.actionTitle = 'Editar documento';
      this._documentsService.getById(id).subscribe({
        next: (document) => {
          this.document = document;
          this.id = document.id;
          this.assingDataToForm(this.document);
        },
        error: (err) => {
          console.error(err);
          this._router.navigate(['/app/empresa/documentos/mostrar']);
        },
      });
    } else {
      this.actionTitle = 'Crear documento';
      this.isEditing = false;
    }
  }

  assingDataToForm(data: Partial<SharedDocument>) {
    data.discountDate = data.discountDate?.split('-').reverse().join('/');
    data.expirationDate = data.expirationDate?.split('-').reverse().join('/');
    this.form.patchValue(data);
    this._cdr.detectChanges();
  }

  isRequired(input: FieldsDocumentCreateModify) {
    return hasAnyError(input, this.form, 'required');
  }

  hasMinLengthError(input: FieldsDocumentCreateModify) {
    return hasAnyError(input, this.form, 'minlength');
  }

  hasMaxLengthError(input: FieldsDocumentCreateModify) {
    return hasAnyError(input, this.form, 'maxlength');
  }

  enforceMinMax(event: KeyboardEvent) {
    const el = event.target as HTMLInputElement;
    const min = parseInt(el.min) || -Infinity;
    const max = parseInt(el.max) || Infinity;

    if (el.value != '') {
      if (parseInt(el.value) < min) {
        el.value = min.toString();
      }
      if (parseInt(el.value) > max) {
        el.value = max.toString();
      }
    }
  }

  enforcePhonePattern(event: Event) {
    const el = event.target as HTMLInputElement;
    const value = el.value.replace(/[^0-9]/g, '').slice(0, 9);

    el.value = value;

    if (value) {
      this.form
        .get('clientPhone')
        ?.setValue(Number(value), { emitEvent: false });
    } else {
      this.form.get('clientPhone')?.setValue(null, { emitEvent: false });
    }
  }

  onDiscountDateChange(date: string) {
    date = date.split('/').reverse().join('-');
    this.form.controls['discountDate'].setValue(date);
  }

  onExpirationDateChange(date: string) {
    date = date.split('/').reverse().join('-');
    this.form.controls['expirationDate'].setValue(date);
  }

  initForm() {
    this.form = this._fb.group({
      documentType: [DocumentTypeEnum.INVOICE, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      currency: [
        CurrencyEnum.PEN,
        [Validators.required, Validators.pattern(/^(PEN|USD|CAD|EUR)$/)],
      ],
      discountDate: [null, [Validators.required]],
      expirationDate: [null, [Validators.required]],
      clientName: ['', [Validators.required, Validators.maxLength(100)]],
      clientPhone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{9}$/)],
      ],
    });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const {
      documentType,
      amount,
      currency,
      discountDate,
      expirationDate,
      clientName,
      clientPhone,
    } = this.form.value;
    if (
      !documentType ||
      !amount ||
      !currency ||
      !discountDate ||
      !expirationDate ||
      !clientName ||
      !clientPhone
    )
      return;

    const documentData = {
      id: this.id,
      documentType,
      amount,
      currency,
      discountDate,
      expirationDate,
      clientName,
      clientPhone,
    };

    // Lógica para decidir si crear o editar el documento
    const request = this.isEditing
      ? this._documentsService.editDocument(documentData)
      : this._documentsService.createDocument(documentData);

    request.subscribe({
      next: (response: any) => {
        this._router.navigateByUrl('/app/empresa/documentos/mostrar');
        toast.success(
          this.isEditing
            ? 'Documento actualizado con éxito!'
            : 'Documento creado con éxito!'
        );
      },
      error: (error: any) => {
        console.error(error);
        const errorMessage =
          error?.error?.message || 'Ocurrió un error interno';
        toast.error(errorMessage);
      },
    });
  }
}
