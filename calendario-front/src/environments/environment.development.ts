export const environment = {
    production: true,
    // URL base del backend de la aplicación
    apiUrl: 'http://localhost:82/',
  
    // URL de redirección del frontend (app Angular)
    baseUrl: 'http://localhost:8084',

    // Configuración de MSAL para autenticación con Azure AD
    clientId: '0ffbc27e-5a3a-4b6b-bcd3-8f06486ecf03',
    // clientId: 'd72569ba-95a4-4dd7-b0d2-f9d6d4d6a223',
    authority: 'https://login.microsoftonline.com/b1ba85eb-a253-4467-9ee8-d4f8ed4df300',
    redirectUri: 'http://localhost:4200/dashboard'
};
