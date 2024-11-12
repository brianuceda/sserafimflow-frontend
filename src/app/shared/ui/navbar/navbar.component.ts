import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { CommonModule } from '@angular/common';
import { sidebarDataCompany } from '../../data-access/data/sidebar-company.data';
import { sidebarDataBank } from '../../data-access/data/sidebar-bank.data';
import { JWTService } from '../../data-access/services/jwt.service';
import { SidebarItem } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private _router = inject(Router);
  private _jwtService = inject(JWTService);

  public arrayPath: any[] = [];
  public items!: SidebarItem[];
  
  constructor() {}

  ngOnInit(): void {
    this.updatePath(this._router.url);

    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePath(this._router.url);
      });
  }

  private updatePath(url: string): void {
    this.items = this._jwtService.isCompany() ? sidebarDataCompany : sidebarDataBank;

    let currentPath = url.split('/').filter((path: string) => path !== '');
    currentPath.shift();
    currentPath.shift();

    // Si hay parametros, no los toma en cuenta
    if (currentPath[currentPath.length - 1].includes('?')) {
      currentPath[currentPath.length - 1] = currentPath[currentPath.length - 1].split('?')[0];
    }

    this.arrayPath = this.convertPathToTitles(currentPath);
  }

  private convertPathToTitles(paths: string[]): string[] {
    const titles: string[] = [];

    paths.forEach(path => {
      const matchedItem = this.findItemByRoute(path, this.items);
      if (matchedItem) {
        titles.push(matchedItem.title);

        // Actualiza los elementos hijos para la siguiente búsqueda
        if (matchedItem.childrens) {
          this.items = matchedItem.childrens;
        }
      }
    });

    return titles;
  }

  // Compara solo la última parte de la ruta
  private findItemByRoute(path: string, items: SidebarItem[]): SidebarItem | undefined {
    return items.find(item => item.route?.split('/').pop() === path);
  }
}
