import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { SidebarItem } from '../../data-access/models/sidebar.model';
import { CommonModule } from '@angular/common';
import { sidebarDataCompany } from '../../data-access/data/sidebar-company.data';
import { sidebarDataBank } from '../../data-access/data/sidebar-bank.data';
import { RoleService } from '../../data-access/services/role.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private _router = inject(Router);
  private _roleService = inject(RoleService);

  public arrayPath: any[] = [];
  public items!: SidebarItem[];
  
  constructor() {
    if (this._roleService.isCompany()) {
      this.items = sidebarDataCompany;
    } else if (this._roleService.isBank()) {
      this.items = sidebarDataBank;
    }
  }

  ngOnInit(): void {
    this.updatePath(this._router.url);

    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePath(this._router.url);
      });
  }

  private updatePath(url: string): void {
    let currentPath = url.split('/').filter((path: string) => path !== '');
    currentPath.shift();

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
