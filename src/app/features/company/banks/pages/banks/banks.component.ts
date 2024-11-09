import { Component, inject } from '@angular/core';
import { LoaderComponent } from '../../../../../shared/components/loader/loader.component';
import { Bank } from '../../../../../shared/data-access/models/bank.model';
import { BanksService } from '../../data-access/services/banks.service';

@Component({
  selector: 'app-banks',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './banks.component.html',
  styleUrl: './banks.component.scss'
})
export default class BanksComponent {
  public isLoading: true | false | null = true;
  public banks: Partial<Bank>[] = [];

  private _banksService = inject(BanksService);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this._banksService.getAllBanksAssociated().subscribe({
      next: (data: Bank[]) => {
        this.banks = data
        
        this.banks.forEach(bank => {
          if (bank) {
            bank.nominalRate = Number((Number(bank.nominalRate) * 100).toFixed(3));
            bank.effectiveRate = Number((Number(bank.effectiveRate) * 100).toFixed(3));
            bank.creationDate = bank.creationDate?.split('-').reverse().join('/');
          }
        });

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
