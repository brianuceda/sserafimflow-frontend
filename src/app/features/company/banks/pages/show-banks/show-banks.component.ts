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
  templateUrl: './show-banks.component.html',
  styleUrl: './show-banks.component.scss',
})
export default class ShowBanksComponent {
  public isLoading: true | false | null = true;

  public listData: Partial<Bank>[] = [];
  public filteredListData: Partial<Bank>[] = [];

  searchInput: string = '';
  lowerSelectedSearchTerm: string = 'id';

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

      this.updateShowedData();
    });
  }

  loadData() {
    this._banksService.getAllBanksAssociated().subscribe({
      next: (data: Bank[]) => {
        this.listData = data.map((item) => ({
          ...item,
          nominalRate: Number((Number(item.nominalRate) * 100).toFixed(3)),
          effectiveRate: Number((Number(item.effectiveRate) * 100).toFixed(3)),
          creationDate: item.creationDate?.split('-').reverse().join('/'),
        }));

        this.filteredListData = this.listData;
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
      this.filteredListData = this.listData;
    }
  }

  onOptionSelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.lowerSelectedSearchTerm = target.value as string;
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
      this.filteredListData = this.listData.filter((item) => {
        const field = item[this.lowerSelectedSearchTerm as keyof Partial<Bank>];
        return (
          field && field.toString().toLowerCase().includes(this.searchInput)
        );
      });
    } else {
      this.filteredListData = this.listData;
    }
  }
}
