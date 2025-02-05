import { DestroyRef, Directive, ElementRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent, startWith, tap } from 'rxjs';

@Directive({
  selector: '[elementPosition]',
})
export class ElementPositionDirective {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef);
  element = signal<HTMLElement>(this.elementRef.nativeElement);
  position = output<DOMRect>({ alias: 'elementPosition' });

  ngOnInit(): void {
    fromEvent(document, 'scroll')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(null),
        debounceTime(400),
        tap(() => this.position.emit(this.element().getBoundingClientRect())),
      )
      .subscribe();
  }
}
