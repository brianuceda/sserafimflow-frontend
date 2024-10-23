import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSoldDocumentsComponent } from './show-sold-documents.component';

describe('ShowSoldDocumentsComponent', () => {
  let component: ShowSoldDocumentsComponent;
  let fixture: ComponentFixture<ShowSoldDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowSoldDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowSoldDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
