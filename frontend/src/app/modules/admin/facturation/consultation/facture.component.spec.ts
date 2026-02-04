import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaisseVersementComponent } from './facture.component';

describe('CaisseVersementComponent', () => {
  let component: CaisseVersementComponent;
  let fixture: ComponentFixture<CaisseVersementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaisseVersementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaisseVersementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
