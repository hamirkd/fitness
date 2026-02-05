import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScolariteComponent } from './index.component';

describe('ScolariteComponent', () => {
  let component: ScolariteComponent;
  let fixture: ComponentFixture<ScolariteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScolariteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScolariteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
