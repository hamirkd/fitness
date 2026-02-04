import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleFactureComponent } from './nouvelle-facture.component';

describe('NouvelleFactureComponent', () => {
  let component: NouvelleFactureComponent;
  let fixture: ComponentFixture<NouvelleFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelleFactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NouvelleFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
