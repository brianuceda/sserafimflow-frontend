import { Component, inject } from '@angular/core';
import { Company } from '../data-access/models/company.model';
import { CompanyService } from '../data-access/services/company.service';
import { CommonModule } from '@angular/common';

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
