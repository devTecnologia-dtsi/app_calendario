export const environment = {
    production: false,
    baseUrl: 'http://localhost:3306/calendarios',
    auth: {
      clientId: "d72569ba-95a4-4dd7-b0d2-f9d6d4d6a223", // Application (client) ID from the app registration
      authority: "https://login.microsoftonline.com/b1ba85eb-a253-4467-9ee8-d4f8ed4df300", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
      redirectUri: 'http://localhost:4200/dashboard',
      postLogoutRedirectUri: 'http://localhost:4200/login'
  
  },
  apiConfig: {
      scopes: ['user.read'],
      uri: 'https://graph.microsoft.com/v1.0/me'
  }
  }
  