import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateModifyDocumentComponent } from './create-modify-document.component';

describe('CreateModifyDocumentComponent', () => {
  let component: CreateModifyDocumentComponent;
  let fixture: ComponentFixture<CreateModifyDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateModifyDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateModifyDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
