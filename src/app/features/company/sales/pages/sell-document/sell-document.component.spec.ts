import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellDocumentComponent } from './sell-document.component';

describe('SellDocumentComponent', () => {
  let component: SellDocumentComponent;
  let fixture: ComponentFixture<SellDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
