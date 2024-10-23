import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCollectedSalesComponent } from './show-collected-sales.component';

describe('ShowCollectedSalesComponent', () => {
  let component: ShowCollectedSalesComponent;
  let fixture: ComponentFixture<ShowCollectedSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCollectedSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCollectedSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
