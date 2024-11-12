import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { SalesService } from '../../services/sales.service';
import { StateEnum } from '../../../../../shared/data-access/models/enums.model';
import { PurchasedDocument } from '../../../../../shared/data-access/models/purchase.model';

@Component({
  selector: 'app-sell-document',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './sell-document.component.html',
  styleUrl: './sell-document.component.scss',
})
export default class SellDocumentComponent {
  isLoading: true | false | null = false;
  documentsPurchased: PurchasedDocument[] = [];

  private _salesService = inject(SalesService);

  ngOnInit() {
    
  }
}
