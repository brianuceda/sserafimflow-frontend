import { ComponentFixture, TestBed } from '@angular/core/testing';
import ShowBanksComponent from './show-banks.component';

describe('BanksComponent', () => {
  let component: ShowBanksComponent;
  let fixture: ComponentFixture<ShowBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowBanksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
