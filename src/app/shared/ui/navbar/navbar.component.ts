import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { sidebarData } from '../../data-access/data/sidebar.data';
import { SidebarItem } from '../../data-access/models/sidebar.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  public arrayPath: any[] = [];

  private _router = inject(Router);

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
    let currentItems = sidebarData;

    paths.forEach(path => {
      const matchedItem = this.findItemByRoute(path, currentItems);
      if (matchedItem) {
        titles.push(matchedItem.title);

        // Actualiza los elementos hijos para la siguiente búsqueda
        if (matchedItem.childrens) {
          currentItems = matchedItem.childrens;
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
