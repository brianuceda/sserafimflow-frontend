import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { sidebarDataCompany } from '../../data-access/data/sidebar-company.data';
import { sidebarDataBank } from '../../data-access/data/sidebar-bank.data';
import { SidebarItem } from '../../data-access/models/sidebar.model';
import { RoleService } from '../../data-access/services/role.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private _router = inject(Router);
  private _roleService = inject(RoleService);
  
  public items!: SidebarItem[];

  constructor() {
    if (this._roleService.isCompany()) {
      this.items = sidebarDataCompany;
    } else if (this._roleService.isBank()) {
      this.items = sidebarDataBank;
    }
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

  private loadActiveAccordions() {
    let currentPath = this._router.url.split('/').filter((path: string) => path !== '');
    currentPath.shift();

    console.log(currentPath);

    if (currentPath.length === 2) {
      let padreId = currentPath[0] + '-accordion';

      this.expandAccordion(padreId);
    }

    if (currentPath.length === 3) {
      let padreId = currentPath[0] + '-accordion';
      let hijoId = currentPath[0] + '-' + currentPath[1] + '-accordion-sub';

      this.expandAccordion(padreId);
      this.expandAccordion(hijoId);
    }
  }

  private expandAccordion(itemId: string) {
    let item = document.getElementById(itemId);
    let itemButton = item?.querySelector('button:first-child');
    let itemContainer = item?.querySelector('#' + itemId);

    // Pinta de color el texto del item
    item?.classList.add('active');
    // Rota el icono del item
    itemButton?.setAttribute('aria-expanded', 'true');
    // Expande el contenido del item
    itemContainer?.classList.add('!block');
  }

  goTo(route: string, ms: number) {
    setTimeout(() => {
      this._router.navigate([route]);
      setTimeout(() => {
        document.getElementById('hs-offcanvas-custom-backdrop-color-backdrop')?.remove();
      }, 50);
    }, ms);
  }

  // Hacer la animación de cambio más suave (opcional)
  // setActive(event: Event) {
  //   event.preventDefault();

  //   const clickedLink = event.target as HTMLElement;
  //   const sidebar = document.querySelector('.sidebar-ul');

  //   if (sidebar) {
  //     const activeItems = sidebar.querySelectorAll('li > a.active');
  //     activeItems.forEach((item) => {
  //       this.renderer.removeClass(item, 'active');
  //     });

  //     // Aplicar solo a los elementos <a>
  //     if (clickedLink.tagName === 'A') {
  //       this.renderer.addClass(clickedLink, 'active');
  //     }
  //   }
  // }
}
