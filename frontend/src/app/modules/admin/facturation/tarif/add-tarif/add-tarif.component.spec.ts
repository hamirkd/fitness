import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalleClasseComponent } from './add-tarif.component';

describe('AddSalleClasseComponent', () => {
  let component: AddSalleClasseComponent;
  let fixture: ComponentFixture<AddSalleClasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSalleClasseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalleClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
