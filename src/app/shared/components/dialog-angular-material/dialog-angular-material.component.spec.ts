import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAngularMaterialComponent } from './dialog-angular-material.component';

describe('DialogAngularMaterialComponent', () => {
  let component: DialogAngularMaterialComponent;
  let fixture: ComponentFixture<DialogAngularMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAngularMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAngularMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
