import { Component, inject } from '@angular/core';
import { Bank } from '../data-access/models/bank.model';
import { BankService } from '../data-access/services/bank.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export default class ProfileComponent {
  private _bankService = inject(BankService);
  bankProfile: Bank | null = null;

  ngOnInit(): void {
    this._bankService.getBankProfile().subscribe({
      next: (data) => (this.bankProfile = data),
      error: (error) => console.error('Error al obtener el perfil del banco', error),
    });
  }
}
