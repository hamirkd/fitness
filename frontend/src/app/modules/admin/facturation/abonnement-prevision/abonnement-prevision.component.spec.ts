import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbonnementPrevisionComponent } from './abonnement-prevision.component';

describe('AbonnementPrevisionComponent', () => {
  let component: AbonnementPrevisionComponent;
  let fixture: ComponentFixture<AbonnementPrevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbonnementPrevisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbonnementPrevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
