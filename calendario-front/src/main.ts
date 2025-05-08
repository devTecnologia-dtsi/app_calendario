import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { MSAL_INSTANCE, MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG, MsalService, MsalBroadcastService, MsalGuard } from '@azure/msal-angular';
import { msalInstance, msalGuardConfig, msalInterceptorConfig } from './app/seguridad/msal-config';
import { TokenInterceptor } from './app/seguridad/token.interceptor';

async function main() {
  //Inicializar MSAL antes del bootstrap
  await msalInstance.initialize();

  const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes),
      provideHttpClient(withInterceptorsFromDi()),
      provideAnimations(),
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      { provide: MSAL_INSTANCE, useValue: msalInstance },
      { provide: MSAL_GUARD_CONFIG, useValue: msalGuardConfig },
      { provide: MSAL_INTERCEPTOR_CONFIG, useValue: msalInterceptorConfig },
      MsalService,
      MsalBroadcastService,
      MsalGuard
    ]
  };

  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
}

main();
