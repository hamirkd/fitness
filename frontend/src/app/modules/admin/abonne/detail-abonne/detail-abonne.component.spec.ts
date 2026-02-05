import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAbonneComponent } from './detail-abonne.component';

describe('DetailAbonneComponent', () => {
  let component: DetailAbonneComponent;
  let fixture: ComponentFixture<DetailAbonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAbonneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAbonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
