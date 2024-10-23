import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPortfoliosComponent } from './show-portfolios.component';

describe('ShowPortfoliosComponent', () => {
  let component: ShowPortfoliosComponent;
  let fixture: ComponentFixture<ShowPortfoliosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPortfoliosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPortfoliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
