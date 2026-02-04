import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaAddComponent } from './media-add.component';

describe('MediaAddComponent', () => {
  let component: MediaAddComponent;
  let fixture: ComponentFixture<MediaAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
