import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalleClasseComponent } from './tarif.component';

describe('SalleClasseComponent', () => {
  let component: SalleClasseComponent;
  let fixture: ComponentFixture<SalleClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalleClasseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalleClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
