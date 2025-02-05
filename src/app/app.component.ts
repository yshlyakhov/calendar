import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly calendarStateService = inject(NotificationService);

  // track change detection
  // ngAfterViewChecked(): void {
  //   console.trace();
  // }
}
