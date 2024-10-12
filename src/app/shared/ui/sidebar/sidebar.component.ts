import { Component, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { sidebarData } from '../../data-access/data/sidebar.data';
import { SidebarItem } from '../../data-access/models/sidebar.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  public items: SidebarItem[] = sidebarData;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.loadIcons();
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

  setActive(event: Event) {
    event.preventDefault();

    const clickedLink = event.target as HTMLElement;
    const sidebar = document.querySelector('.sidebar-ul');

    if (sidebar) {
      const activeItems = sidebar.querySelectorAll('li > a.active');
      activeItems.forEach((item) => {
        this.renderer.removeClass(item, 'active');
      });

      // Aplicar solo a los elementos <a>
      if (clickedLink.tagName === 'A') {
        this.renderer.addClass(clickedLink, 'active');
      }
    }
  }
}
