import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySeanceComponent } from './my-seance.component';

describe('MySeanceComponent', () => {
  let component: MySeanceComponent;
  let fixture: ComponentFixture<MySeanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySeanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
