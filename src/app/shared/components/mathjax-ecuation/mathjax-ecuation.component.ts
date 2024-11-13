import { Component, Input, AfterViewInit } from '@angular/core';
import { SafeHtmlPipe } from '../../data-access/pipes/safehtml.pipe';

declare var MathJax: any;

@Component({
  selector: 'app-mathjax-ecuation',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './mathjax-ecuation.component.html',
  styleUrls: ['./mathjax-ecuation.component.scss'],
})
export class MathjaxEcuationComponent implements AfterViewInit {
  @Input() latexCode: string = '';

  ngAfterViewInit() {
    this.renderMath();
  }

  // Forzar la renderización de MathJax cada vez que latexCode cambie
  ngOnChanges() {
    this.renderMath();
  }

  renderMath() {
    setTimeout(() => {
      if (MathJax) {
        MathJax.typesetPromise();
      }
    }, 0);
  }
}
