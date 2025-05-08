import { PublicClientApplication, InteractionType, LogLevel } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: 'd72569ba-95a4-4dd7-b0d2-f9d6d4d6a223',
    authority: 'https://login.microsoftonline.com/b1ba85eb-a253-4467-9ee8-d4f8ed4df300',
    redirectUri: 'http://localhost:4200/dashboard'
    //redirectUri: 'http://localhost:4200', // redirección tras login
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (!containsPii) console.log(message);
      },
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false
    }
  }
});

export const msalGuardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Redirect,
  authRequest: {
    scopes: ['user.read']
  }
};

export const msalInterceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,
  protectedResourceMap: new Map()
};
