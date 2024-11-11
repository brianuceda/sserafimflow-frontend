import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteDocumentComponent } from './confirm-delete-document.component';

describe('ConfirmDeleteDocumentComponent', () => {
  let component: ConfirmDeleteDocumentComponent;
  let fixture: ComponentFixture<ConfirmDeleteDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
