import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilPasswordComponent } from './profil-password.component';

describe('ProfilPasswordComponent', () => {
  let component: ProfilPasswordComponent;
  let fixture: ComponentFixture<ProfilPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
