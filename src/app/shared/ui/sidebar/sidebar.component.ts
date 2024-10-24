import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { sidebarDataCompany } from '../../data-access/data/sidebar-company.data';
import { sidebarDataBank } from '../../data-access/data/sidebar-bank.data';
import { SidebarItem } from '../../data-access/models/sidebar.model';
import { JWTService } from '../../data-access/services/jwt.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private _router = inject(Router);
  private _jwtService = inject(JWTService);

  public realName: string | undefined;
  public username: string | undefined;
  public image: string | undefined;
  
  public items!: SidebarItem[];

  constructor() {
    // Siebar Data
    if (this._jwtService.isCompany()) {
      this.items = sidebarDataCompany;
    } else if (this._jwtService.isBank()) {
      this.items = sidebarDataBank;
    }

    // Real Name
    this.realName = this._jwtService.getRealName();

    // Username
    this.username = this._jwtService.getUsername();

    // Image
    this.image = this._jwtService.getImage() || 'images/no-image-selected.webp';
  }

  ngAfterViewInit() {
    this.loadIcons();
    this.loadActiveAccordions();
  }

  loadIcons() {
    for (let i = 0; i < this.items.length; i++) {
      let father = document.querySelector('#icon-' + i);
      father?.insertAdjacentHTML(
        'beforeend',
        '<span>' + this.items[i].icon + '</span>'
      );
    }
  }

  combinePathsOnFather(fatherPath: string | undefined) {
    return fatherPath?.replace('/', '_');
  }

  private loadActiveAccordions() {
    let currentPath = this._router.url.split('/').filter((path: string) => path !== '');
    currentPath.shift();
    let firstTwo = currentPath.slice(0, 2).join('/').replace('/', '_');
    let rest = currentPath.slice(2).join('/');

    let separatedPaths = [firstTwo, rest];

    if (separatedPaths.length === 2) {
      let padreId = separatedPaths[0] + '-accordion';

      this.expandAccordion(padreId);
    }

    if (separatedPaths.length === 3) {
      let padreId = separatedPaths[0] + '-accordion';
      let hijoId = separatedPaths[0] + '-' + separatedPaths[1] + '-accordion-sub';

      this.expandAccordion(padreId);
      this.expandAccordion(hijoId);
    }
  }

  private expandAccordion(itemId: string) {
    let item = document.getElementById(itemId);
    let itemButton = item?.querySelector('button:first-child');
    let itemContainer = item?.querySelector('#' + itemId);

    item?.classList.add('active'); // Color del texto
    itemButton?.setAttribute('aria-expanded', 'true'); // Rotación del icono
    itemContainer?.classList.add('!block'); // Expansión del contenido
  }

  navigate(route: string) {
    setTimeout(() => {
      this._router.navigate([route]);
      setTimeout(() => {
        document.getElementById('hs-offcanvas-custom-backdrop-color-backdrop')?.remove();
      }, 50);
    }, 300);
  }

  logout(message?: string) {
    this._jwtService.removeToken();
    this._jwtService.returnToHome();
    toast.success(message || 'Sesión cerrada correctamente');
  }
}
