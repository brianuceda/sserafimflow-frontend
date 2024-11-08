import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { DocumentsService } from '../../data-access/services/documents.service';
import { StateEnum } from '../../../../../shared/data-access/models/enums.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-documents',
  standalone: true,
  imports: [LoaderComponent, FormsModule, CommonModule],
  templateUrl: './show-documents.component.html',
  styleUrl: './show-documents.component.scss',
})
export default class ShowDocumentsComponent {
  public isLoading: true | false | null = true;
  public selectedState: StateEnum = StateEnum.ALL;

  documents: Document[] = [];

  private _documentsService = inject(DocumentsService);

  ngOnInit() {
    this.loadData();
  }

  changeCurrency(event: any) {
    this.selectedState = event.target.value;
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this._documentsService.getAllDocuments(this.selectedState).subscribe({
      next: (data) => {
        this.documents = { ...data };
        this.isLoading = false;

        console.log('Documents', this.documents);
      },
      error: (error) => {
        this.isLoading = null;
        console.error(error);
      },
    });
  }
}
