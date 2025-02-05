import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentEditModalComponent } from './appointment-edit-modal.component';

describe('AppointmentEditModalComponent', () => {
  let component: AppointmentEditModalComponent;
  let fixture: ComponentFixture<AppointmentEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentEditModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
