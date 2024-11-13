import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPrintComponent } from './dashboard-print.component';

describe('DashboardPrintComponent', () => {
  let component: DashboardPrintComponent;
  let fixture: ComponentFixture<DashboardPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
