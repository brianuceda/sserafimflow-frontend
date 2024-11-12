import { Component, inject } from '@angular/core';
import { Portfolio } from '../../../../../shared/data-access/models/portfolio.model';
import { PortfoliosService } from '../../data-access/services/portfolios.service';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-show-portfolios',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './show-portfolios.component.html',
  styleUrl: './show-portfolios.component.scss'
})
export default class ShowPortfoliosComponent {
  public isLoading: true | false | null = true;
  public portfolios: Partial<Portfolio>[] = [];

  private _portfoliosService = inject(PortfoliosService);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._portfoliosService.getAllPortfolios().subscribe({
      next: (data: Portfolio[]) => {
        this.portfolios = data
        this.isLoading = false;

        console.log(data);
      },
      error: (error) => {
        this.isLoading = null;
        console.error(error);
      }
    })
  }
}
