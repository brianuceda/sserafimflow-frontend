import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerFlowbiteComponent } from './datepicker-flowbite.component';

describe('DatepickerFlowbiteComponent', () => {
  let component: DatepickerFlowbiteComponent;
  let fixture: ComponentFixture<DatepickerFlowbiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerFlowbiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatepickerFlowbiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
