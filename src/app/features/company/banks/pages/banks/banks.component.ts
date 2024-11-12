import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { Bank } from '../../../../../shared/data-access/models/bank.model';
import { BanksService } from '../../data-access/services/banks.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [LoaderComponent, CommonModule, FormsModule],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss',
})
export default class BanksComponent {
  public isLoading: true | false | null = true;

  public banks: Partial<Bank>[] = [];
  public filteredBanks: Partial<Bank>[] = [];

  searchInput: string = '';
  lowerSelectedSearchTerm:
    | 'id'
    | 'realName'
    | 'ruc'
    | 'nominalRate'
    | 'effectiveRate' = 'id';

  private _banksService = inject(BanksService);
  private _activateRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.getSearchParamsFromURL();
    this.loadData();
  }

  getSearchParamsFromURL() {
    this._activateRoute.queryParams.subscribe((params) => {
      const paramKeys = Object.keys(params);

      if (paramKeys.length === 1) {
        this.lowerSelectedSearchTerm =
          paramKeys[0] as typeof this.lowerSelectedSearchTerm;
        this.searchInput = params[paramKeys[0]];
      }

      console.log('this.searchInput', this.searchInput);
      console.log('this.lowerSelectedSearchTerm', this.lowerSelectedSearchTerm);

      this.updateShowedData();
    });
  }

  loadData() {
    this._banksService.getAllBanksAssociated().subscribe({
      next: (data: Bank[]) => {
        this.banks = data.map((bank) => ({
          ...bank,
          nominalRate: Number((Number(bank.nominalRate) * 100).toFixed(3)),
          effectiveRate: Number((Number(bank.effectiveRate) * 100).toFixed(3)),
          creationDate: bank.creationDate?.split('-').reverse().join('/'),
        }));

        this.filteredBanks = this.banks;
        this.isLoading = false;

        this.updateShowedData();
      },
      error: (error) => {
        this.isLoading = null;
        console.error(error);
      },
    });
  }

  resetTableConfig(isInitLoad: boolean = false) {
    if (isInitLoad && this.searchInput && this.lowerSelectedSearchTerm) {
      this.updateShowedData();
    } else {
      this.searchInput = '';
      this.lowerSelectedSearchTerm = 'id';
      this.filteredBanks = this.banks;
    }
  }

  onOptionSelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.lowerSelectedSearchTerm = target.value as
        | 'id'
        | 'realName'
        | 'ruc'
        | 'nominalRate'
        | 'effectiveRate';
      this.updateShowedData();
    }
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput = input.value.toLowerCase().trim();
    this.updateShowedData();
  }

  updateShowedData() {
    if (this.searchInput && this.lowerSelectedSearchTerm) {
      this.filteredBanks = this.banks.filter((bank) => {
        const field = bank[this.lowerSelectedSearchTerm];
        return (
          field && field.toString().toLowerCase().includes(this.searchInput)
        );
      });
    } else {
      this.filteredBanks = this.banks;
    }
  }
}
