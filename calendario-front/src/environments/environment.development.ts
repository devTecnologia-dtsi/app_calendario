export const environment = {
    production: false,
  
    // URL base del backend de tu aplicación
    apiUrl: 'http://localhost:82/',
  
    // URL de redirección del frontend (tu app Angular)
    baseUrl: 'http://localhost:4200',
  
    // // Configuración MSAL
    // auth: {
    //   clientId: 'd72569ba-95a4-4dd7-b0d2-f9d6d4d6a223',
    //   authority: 'https://login.microsoftonline.com/b1ba85eb-a253-4467-9ee8-d4f8ed4df300',
    //   redirectUri: 'http://localhost:4200', // redirección tras login
    //   postLogoutRedirectUri: 'http://localhost:4200/login'
    // },
  
    // // Configuración para Graph API (puedes dejarlo si la usas)
    // apiConfig: {
    //   scopes: ['user.read'],
    //   uri: 'https://graph.microsoft.com/v1.0/me'
    // },
  
    // // Prueba de API protegida
    // protectedApi: {
    //   uri: 'http://localhost:82/api/protegido',
    //   scopes: ['api://d72569ba-95a4-4dd7-b0d2-f9d6d4d6a223/access_as_user']
    // }
  };
  