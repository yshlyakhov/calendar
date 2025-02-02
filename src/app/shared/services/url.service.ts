import { Location } from '@angular/common';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { Params, Router } from '@angular/router';

export const URL_SERVICE = new InjectionToken<UrlService>('URL_SERVICE');

@Injectable()
export class UrlService {
  readonly router = inject(Router);
  readonly location = inject(Location);

  changeUrl(url: string): void {
    this.location.replaceState(url);
  }

  getCurrentUrl(commands: string[], params: Params = {}): string {
    const queryParams = Object.keys(params).reduce((acc, key) => {
        if (params[key]) {
            acc[key] = params[key];
        }
        return acc;
    }, {} as Params);

    const urlTree = this.router.createUrlTree(commands, { queryParams });
    return this.router.serializeUrl(urlTree);
  }
}
