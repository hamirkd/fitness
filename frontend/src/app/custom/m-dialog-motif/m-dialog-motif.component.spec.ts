import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MDialogMotifComponent } from './m-dialog-motif.component';

describe('MDialogMotifComponent', () => {
  let component: MDialogMotifComponent;
  let fixture: ComponentFixture<MDialogMotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MDialogMotifComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MDialogMotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
