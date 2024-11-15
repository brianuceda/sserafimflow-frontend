import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModifyPortfolioComponent } from './create-modify-portfolio.component';

describe('CreateModifyPortfolioComponent', () => {
  let component: CreateModifyPortfolioComponent;
  let fixture: ComponentFixture<CreateModifyPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateModifyPortfolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateModifyPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
