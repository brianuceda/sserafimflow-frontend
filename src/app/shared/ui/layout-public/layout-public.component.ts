import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-public',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './layout-public.component.html',
  styleUrl: './layout-public.component.scss'
})
export default class LayoutPublicComponent {

}
