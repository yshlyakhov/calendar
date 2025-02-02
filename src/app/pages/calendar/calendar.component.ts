import { ChangeDetectionStrategy, Component, effect, inject, model } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Router, RouterOutlet } from '@angular/router';
import { RoutesConfig } from '@configs';

@Component({
  selector: 'app-calendar',
  imports: [
    RouterOutlet,
    MatDatepickerModule,
  ],
  providers: [

  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  private readonly router = inject(Router);

  selected = model<Date | null>(new Date());

  constructor() {
    effect(() => {
      console.log(this.selected());

    });


  }

  dateChanged(date: Date): void {
    let commands;
    if (this.isToday()) {
      commands = [RoutesConfig.calendar.calendar, RoutesConfig.calendar.today];
    } else {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      commands = [RoutesConfig.calendar.calendar, year, month, day];
    }
    this.router.navigate(commands);
  }

  private isToday(): boolean {
    return new Date().setHours(0,0,0,0) === this.selected()?.getTime();
  }
}
