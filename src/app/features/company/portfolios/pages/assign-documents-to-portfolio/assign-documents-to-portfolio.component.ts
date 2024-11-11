import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assign-documents-to-portfolio',
  standalone: true,
  imports: [],
  templateUrl: './assign-documents-to-portfolio.component.html',
  styleUrl: './assign-documents-to-portfolio.component.scss',
})
export default class AssignDocumentsToPortfolioComponent {
  private _activateRoute = inject(ActivatedRoute);
  selectedColumns!: Set<number>;

  ngOnInit() {
    this._activateRoute.queryParams.subscribe((params) => {
      const ids = params['ids'] ? params['ids'].split(',').map(Number) : [];
      this.selectedColumns = new Set(ids);

      let response = this.selectedColumns.size > 0 ? Array.from(this.selectedColumns) : 'No se encontraron parámetros';

      console.log(response);
    });
  }
}
