import { Component, inject } from '@angular/core';
import { CompanyService } from '../data-access/services/company.service';
import { CommonModule } from '@angular/common';
import { Company } from '../../../../shared/data-access/models/company.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export default class ProfileComponent {
  private _companyService = inject(CompanyService);
  companyProfile: Company | null = null;

  ngOnInit(): void {
    this._companyService.getCompanyProfile().subscribe({
      next: (data) => (this.companyProfile = data),
      error: (error) => console.error('Error al obtener el perfil de la empresa', error),
    });
  }
}
