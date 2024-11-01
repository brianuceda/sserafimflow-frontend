import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MathjaxEcuationComponent } from './mathjax-ecuation.component';

describe('MathjaxEcuationComponent', () => {
  let component: MathjaxEcuationComponent;
  let fixture: ComponentFixture<MathjaxEcuationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathjaxEcuationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MathjaxEcuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
