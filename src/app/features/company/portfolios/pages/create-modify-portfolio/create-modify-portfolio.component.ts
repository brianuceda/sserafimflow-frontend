import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Portfolio } from '../../../../../shared/data-access/models/portfolio.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { hasAnyError } from '../../../../../shared/utils/form-validators';
import { PortfoliosService } from '../../data-access/services/portfolios.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-create-modify-portfolio',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-modify-portfolio.component.html',
  styleUrl: './create-modify-portfolio.component.scss'
})
export default class CreateModifyPortfolioComponent {
  public data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<CreateModifyPortfolioComponent>);
  
  public state: 'create' | 'edit' = 'create';

  public form!: FormGroup;
  private portfolio: Partial<Portfolio> = {};
  
  private _formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private _activateRoute = inject(ActivatedRoute);
  
  private _portfoliosService = inject(PortfoliosService);

  constructor() {
    this.form = this._formBuilder.group({
      name: this._formBuilder.control<string | null>('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
    });
  }

  ngOnInit() {
    let id = this.data.id;

    if (id) {
      this.state = 'edit';
      
      this._portfoliosService.getPortfolioById(id).subscribe({
        next: (data) => {
          this.form.patchValue(data);
        },
        error: (err) => {
          this.state = 'create';
          console.error(err);
        },
      });
    }
  }

  isRequired(input: { field: 'name' }) {
    return hasAnyError(input, this.form, 'required');
  }

  hasMaxLengthError(input: { field: 'name' }) {
    return hasAnyError(input, this.form, 'maxlength');
  }

  createEditPortfolio() {
    if (this.form.invalid) {
      return;
    }

    this.portfolio = this.form.value;

    if (this.state === 'create') {
      this._portfoliosService.createPortfolio(this.portfolio).subscribe({
        next: (data) => {
          toast.success(data.message);
          this.dialogRef.close('confirmed');
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.portfolio.id = this.data.id;
      this._portfoliosService.updatePortfolio(this.portfolio).subscribe({
        next: (data) => {
          toast.success(data.message);
          this.dialogRef.close('confirmed');
        },
        error: (err) => {
          console.error(err);
        },
      });
    }

  }
}
