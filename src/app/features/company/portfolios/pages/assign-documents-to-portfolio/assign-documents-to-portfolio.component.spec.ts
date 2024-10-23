import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDocumentsToPortfolioComponent } from './assign-documents-to-portfolio.component';

describe('AssignDocumentsToPortfolioComponent', () => {
  let component: AssignDocumentsToPortfolioComponent;
  let fixture: ComponentFixture<AssignDocumentsToPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDocumentsToPortfolioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignDocumentsToPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
