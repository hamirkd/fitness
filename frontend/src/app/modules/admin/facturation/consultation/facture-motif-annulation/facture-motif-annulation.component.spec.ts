import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureMotifAnnulationComponent } from './facture-motif-annulation.component';

describe('FactureMotifAnnulationComponent', () => {
  let component: FactureMotifAnnulationComponent;
  let fixture: ComponentFixture<FactureMotifAnnulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureMotifAnnulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactureMotifAnnulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
