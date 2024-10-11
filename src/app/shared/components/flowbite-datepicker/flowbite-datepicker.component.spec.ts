import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowbiteDatepickerComponent } from './flowbite-datepicker.component';

describe('FlowbiteDatepickerComponent', () => {
  let component: FlowbiteDatepickerComponent;
  let fixture: ComponentFixture<FlowbiteDatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowbiteDatepickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowbiteDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
