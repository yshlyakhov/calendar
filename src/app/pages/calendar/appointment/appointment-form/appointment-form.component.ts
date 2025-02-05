import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, model, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_TIMEPICKER_CONFIG, MatTimepickerModule } from '@angular/material/timepicker';
import { debounceTime, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Appointment, AppointmentCreateData } from '@pages/calendar/common/calendar.models';

type AppointmentFormType = {
  [K in keyof Appointment]: FormControl<Appointment[K]>;
}

const timeRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const { startTime, endTime } = group.value;
  const errors = startTime && endTime && (startTime >= endTime) ? { timeRange: true } : null;
  if (group.get('startTime')?.valid || group.get('startTime')?.hasError('timeRange')) {
    group.get('startTime')?.setErrors(errors);
  }
  return errors;
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
  private readonly fb = inject(FormBuilder);
  form!: FormGroup<AppointmentFormType>;
  readonly initialDate: Date | null = null;
  readonly dateFormat = signal<string>('DD/MM/YYYY');
  readonly timeFormat = signal<string>('HH:MM');
  readonly dateError = signal<string>('');
  readonly startTimeError = signal<string>('');
  readonly endTimeError = signal<string>('');
  readonly data = input<AppointmentCreateData>();
  readonly formInvalid = model<boolean>();
  readonly formValue = model<Appointment>();

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
        date: [this.initialDate, { validators: [Validators.required] }],
        startTime: [this.initialDate, { validators: [Validators.required] }],
        endTime: [this.initialDate, { validators: [Validators.required] }],
        description: [''],
      },
      {
        validators: [timeRangeValidator],
        // updateOn: 'blur',
      }
    );
  }

  private patchForm(): void {
    this.form.patchValue(new Appointment(this.data()));
  }

  private handleForm(): void {
    merge(this.form.get('date')!.statusChanges, this.form.get('date')!.valueChanges)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
      )
      .subscribe(() => {
        this.dateError.set(this.getErrorMessage(this.form.get('date')!));
      });

    merge(this.form.get('startTime')!.statusChanges, this.form.get('startTime')!.valueChanges)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(400),
      )
      .subscribe(() => {
        this.startTimeError.set(this.getErrorMessage(this.form.get('startTime')!));
      });

    merge(this.form.get('endTime')!.statusChanges, this.form.get('endTime')!.valueChanges)
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
