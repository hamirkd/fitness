import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauAbonnementComponent } from './nouveau-abonnement.component';

describe('NouveauAbonnementComponent', () => {
  let component: NouveauAbonnementComponent;
  let fixture: ComponentFixture<NouveauAbonnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauAbonnementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NouveauAbonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
