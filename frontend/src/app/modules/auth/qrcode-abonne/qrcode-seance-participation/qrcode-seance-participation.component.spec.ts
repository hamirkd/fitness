import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeSeanceParticipationComponent } from './qrcode-seance-participation.component';

describe('QrcodeSeanceParticipationComponent', () => {
  let component: QrcodeSeanceParticipationComponent;
  let fixture: ComponentFixture<QrcodeSeanceParticipationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeSeanceParticipationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodeSeanceParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
