import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartApexchartsComponent } from './chart-apexcharts.component';

describe('ChartApexchartsComponent', () => {
  let component: ChartApexchartsComponent;
  let fixture: ComponentFixture<ChartApexchartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartApexchartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartApexchartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
