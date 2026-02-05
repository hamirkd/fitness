import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbonneComponent } from './add-abonne.component';

describe('AddAbonneComponent', () => {
  let component: AddAbonneComponent;
  let fixture: ComponentFixture<AddAbonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAbonneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAbonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
