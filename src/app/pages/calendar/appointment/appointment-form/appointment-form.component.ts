import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, model, ModelSignal, signal } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_TIMEPICKER_CONFIG, MatTimepickerModule } from '@angular/material/timepicker';
import { debounceTime, map, timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Appointment, APPOINTMENT_CONFIG, AppointmentAction, AppointmentCreateData } from '@pages/calendar/common/calendar.models';
import { AppointmentService } from '../common/appointment.service';
import { coerceAppointmentDate, updateDateByTime } from '@pages/calendar/common/date.helper';

type AppointmentFormType = {
  [K in keyof Appointment]: FormControl<Appointment[K]>;
}

const timeRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const { startTime, endTime } = coerceAppointmentDate(group.value);
  const errors = startTime && endTime && (startTime >= endTime) ? { timeRange: true } : null;
  if (group.get('startTime')?.valid || group.get('startTime')?.hasError('timeRange')) {
    group.get('startTime')?.setErrors(errors);
  }
  return errors;
}

const overlapingAsyncValidator = (appointmentService: AppointmentService, formInvalid: ModelSignal<boolean|undefined>): AsyncValidatorFn => {
  return (group: AbstractControl) => {
    return timer(100)
      .pipe(
        map(() => {
          const errors = appointmentService.checkTimeOverlaping(group.value) ? { appointmentOverlaping: true } : null;
          formInvalid.set(Boolean(errors));
          return errors;
        }),
      );
  }
}

@Component({
  selector: 'app-appointment-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_TIMEPICKER_CONFIG,
      useValue: { interval: '15 minutes' },
    }
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentFormComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly appointmentService = inject(AppointmentService);
  private readonly fb = inject(FormBuilder);
  form!: FormGroup<AppointmentFormType>;
  readonly initialDate: Date | null = null;
  readonly dateFormat = signal<string>('DD/MM/YYYY');
  readonly timeFormat = signal<string>('HH:MM');
  readonly dateError = signal<string>('');
  readonly startTimeError = signal<string>('');
  readonly endTimeError = signal<string>('');
  readonly mode = input<AppointmentAction>();
  readonly data = input<AppointmentCreateData | Appointment>();
  readonly formInvalid = model<boolean>();
  readonly formValue = model<Appointment>();
  readonly appointmentConfig = signal(APPOINTMENT_CONFIG);

  ngOnInit(): void {
    this.createForm();
    this.patchForm();
    this.handleForm();
  }

  private createForm(): void {
    this.form = this.fb.nonNullable.group(
      {
        id: ['', { validators: [Validators.required] }],
        title: [''],
        date: [new Date(), { validators: [Validators.required] }],
        startTime: [new Date(),{ validators: [Validators.required] }],
        endTime: [new Date(),{ validators: [Validators.required] }],
        description: [''],
        lastModified: [Date.now()],
      },
      {
        validators: [timeRangeValidator],
        asyncValidators: [overlapingAsyncValidator(this.appointmentService, this.formInvalid)],
        // updateOn: 'blur',
      }
    );
  }

  private patchForm(): void {
    if (this.mode() === AppointmentAction.EDIT) {
      this.form.patchValue(this.data() as Appointment);
    } else {
      this.form.patchValue(new Appointment(this.data() as AppointmentCreateData));
    }
  }

  private handleForm(): void {
    this.form.get('date')?.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
      )
      .subscribe((date: Date|null) => {
        this.dateError.set(this.getErrorMessage(this.form.get('date')!));

        // sync date and times
        if (!this.form.get('date')?.errors && !this.form.get('startTime')?.errors && !this.form.get('endTime')?.errors ) {
          this.form.get('startTime')?.setValue(updateDateByTime(date!, this.form.get('startTime')?.value!));
          this.form.get('endTime')?.setValue(updateDateByTime(date!, this.form.get('endTime')?.value!));
        }
      });

    this.form.get('startTime')?.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
      )
      .subscribe(() => {
        this.startTimeError.set(this.getErrorMessage(this.form.get('startTime')!));
      });

    this.form.get('endTime')?.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
      )
      .subscribe(() => {
        this.endTimeError.set(this.getErrorMessage(this.form.get('endTime')!));
      });

    this.form.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
      )
      .subscribe(() => {
        this.formInvalid.set(this.form.invalid);
        this.formValue.set(this.form.getRawValue());
      });
  }

  private getErrorMessage(formControl: AbstractControl): string {
    if (formControl.hasError('matDatepickerParse') || formControl.hasError('matTimepickerParse')) {
      return 'Value is invalid';
    } else if (formControl.hasError('required')) {
      return 'Field is required';
    } else if (formControl.hasError('timeRange')) {
      return 'Start time is greater then End time';
    }
    return '';
  }
}
