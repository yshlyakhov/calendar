import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCreateModalComponent } from './appointment-create-modal.component';

describe('AppointmentCreateModalComponent', () => {
  let component: AppointmentCreateModalComponent;
  let fixture: ComponentFixture<AppointmentCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentCreateModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
