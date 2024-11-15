import { Component, inject } from '@angular/core';
import { Portfolio } from '../../../../../shared/data-access/models/portfolio.model';
import { PortfoliosService } from '../../data-access/services/portfolios.service';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-portfolios',
  standalone: true,
  imports: [LoaderComponent, CommonModule, FormsModule],
  templateUrl: './show-portfolios.component.html',
  styleUrl: './show-portfolios.component.scss',
})
export default class ShowPortfoliosComponent {
  public isLoading: true | false | null = true;

  public listData: Partial<Portfolio>[] = [];
  public filteredListData: Partial<Portfolio>[] = [];

  searchInput: string = '';
  lowerSelectedSearchTerm: string = 'id';

  private _portfoliosService = inject(PortfoliosService);
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
    this._portfoliosService.getAllPortfolios().subscribe({
      next: (data: Portfolio[]) => {
        this.listData = data.map((item) => ({
          ...item,
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
        const field =
        item[this.lowerSelectedSearchTerm as keyof Partial<Portfolio>];
        return (
          field && field.toString().toLowerCase().includes(this.searchInput)
        );
      });
    } else {
      this.filteredListData = this.listData;
    }
  }
}
