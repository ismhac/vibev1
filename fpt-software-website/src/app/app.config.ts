import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { 
  GlobalOutline, 
  DownOutline, 
  CheckCircleOutline,
  HomeOutline,
  InfoCircleOutline,
  BankOutline,
  SoundOutline,
  ContactsOutline
} from '@ant-design/icons-angular/icons';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideNzIcons([
      GlobalOutline,
      DownOutline,
      CheckCircleOutline,
      HomeOutline,
      InfoCircleOutline,
      BankOutline,
      SoundOutline,
      ContactsOutline
    ]),
  ],
};
